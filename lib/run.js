const { report } = require('./report')

const url = require('url')

const { basename } = require('path')

// todo change to static import when t3st is converted to .mjs
const esmjs = import('./esmjs.mjs')

// TODO create version (or extract logic) of run so that:
// you can have a stand-alone test file that can be run as:
// node my-test-file.js
// that also accepts some of the cli options, eg --silent, --noisy.

module.exports = (validation, io) =>
    async (
        {
            test_dir,
            file_filter = x => x.endsWith('.mjs') || x.endsWith('.js'),
            noisy = false,
            silent = false
        } = {}) => {

        const trim_styntax_error_stack = (err, stack) =>
            !stack.includes("SyntaxError: ")
                ? stack
                : stack
                    .split("\n")
                    .filter(line => !line.includes("internal/modules/"))
                    .filter(line => !line.includes(" (vm.js:"))
                    .filter(line => !line.includes(err))
                    .join("\n")

        const { jsmodule } = await esmjs

        const test_inject = { jsmodule, ...validation }

        const test_file = async (file_path) => {
            try {
                const file_href = url.pathToFileURL(file_path).href

                const test_module = await import(file_href)
                const test = test_module.default
                return test(test_inject)
            } catch (err) {
                return {
                    description: `Error in file : ${file_path}`,
                    has_error: true,
                    error: `exception occurred *outside* of tests:\n\t-> ${err}`,
                    trace: ` ${trim_styntax_error_stack(err, err.stack || 'unknown source')}`,
                    has_validation_error: false,
                    is_file_parse_error: true
                }
            }
        }

        const test_results = await Promise.all(io
            .walk_dir(test_dir)
            .filter(file_path => file_filter(basename(file_path)))
            .map(test_file)
        )

        const results = await Promise.all(test_results.flat(99))

        report({ results, noisy, silent })

        if (results.some(t => typeof t === 'undefined' || t.trace) || results.length === 0) {
            io.flagExitError()
        }
    }