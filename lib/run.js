const { report } = require('./report')

const url = require('url')

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

        const test_file = async (file_path) => {
            try {
                const file_href = url.pathToFileURL(file_path).href

                const test_module = await import(file_href)
                const test = test_module.default
                return test(validation)
            } catch (err) {
                return {
                    description: `Error in file : ${file_path}`,
                    is_error: true,
                    error: `exception occurred *outside* of tests:\n\t-> ${err}`,
                    trace: ` ${trim_styntax_error_stack(err, err.stack || 'unknown source')}`,
                    is_validation_error: false,
                    is_file_parse_error: true
                }
            }
        }

        process.on('unhandledRejection', (reason, promise) => {
            if (!silent) {
                console.log('⚔️🔥 Unhandled Rejection at:', promise, 'reason:', reason);
            }
            io.flagExitError()
        });

        const test_results = await Promise.all(io
            .walk_dir(test_dir)
            .filter(file_filter)
            .map(test_file)
        )

        const results = await Promise.all(test_results.flat(99))

        report({ results, noisy, silent })

        if (results.some(t => t.trace) || results.length === 0) {
            io.flagExitError()
        }
    }