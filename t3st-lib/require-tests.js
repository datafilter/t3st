module.exports = (io, framework) => async (dir, label = '', func = console.log) => {

    const test_file = (file_path) => {
        try {
            return require(file_path)(framework)
        } catch (err) {
            return {
                description: `Error in file : ${file_path}`,
                error: `[err] exception occurred outside of tests\n\t--> ${err}`,
                trace: ` ${err.stack || 'unknown source'}`
            }
        }
    }

    const test_results = await Promise.all(io.walk_dir(dir).map(test_file))

    const summary = framework.tally_results(label, test_results)

    func(summary)
}