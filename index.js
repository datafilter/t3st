const { test, assert, affirm } = require('./lib/t3st')
const { result_text, tally_results } = require('./lib/text')

const framework = { test, assert, affirm, result_text, tally_results }

const io = require('./lib/io')

const test_file = (file_path) => {
    try {
        return require(file_path)(framework)
    } catch (err) {
        return {
            description: `Error in file : ${file_path}`,
            error:
                `[err] exception occurred outside of tests\n\t--> ${err}`
        }
    }
}

const test_output = async (dir, label = '', func = console.log) => {
    const test_results = await Promise.all(
        io.walk_dir(dir)
            .map(test_file))
    const summary = tally_results(label, test_results)
    func(summary)
}

module.exports = {
    test
    , assert
    , affirm
    , result_text
    , tally_results
    , test_output
}
