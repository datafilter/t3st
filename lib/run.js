const { report } = require('./report')

module.exports = (validation, io) =>
    async (
        {
            test_dir,
            file_filter = x => x.endsWith('.js'),
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

        const test_results = await Promise.all(io
            .walk_dir(test_dir)
            .filter(file_filter)
            .map(test_file)
        )

        const results = await Promise.all(test_results.flat(99))

        report({ results, noisy, silent })

        if (results.some(t => t.trace)) {
            io.flagExitError()
        }
    }