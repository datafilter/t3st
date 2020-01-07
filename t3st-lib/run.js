const path = require('path')

module.exports = (validation, io, tally_results) =>
    async (
        {
            entrypoint_dir = path.dirname(require.main.filename),
            dir = 'tests',
            label = '',
            process_summary = console.log,
            file_filter = x => x.endsWith('.js')
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

        const test_file = (file_path) => {
            try {
                return require(file_path)(validation)
            } catch (err) {
                return {
                    description: `Error in file : ${file_path}`,
                    error: `exception occurred *outside* of tests\n\t--> ${err}`,
                    trace: ` ${trim_styntax_error_stack(err, err.stack || 'unknown source')}`
                }
            }
        }

        const test_dir = path.join(entrypoint_dir, dir)

        const test_results = await Promise.all(io
            .walk_dir(test_dir)
            .filter(file_filter)
            .map(test_file)
        )

        const flat_results = await Promise.all(test_results.flat(99))

        const summary = tally_results(label, flat_results)

        if (flat_results.some(t => typeof t.error !== 'undefined')) {
            io.flagExitError()
        }

        return process_summary(summary)
    }