const { test, assert, affirm } = require('./t3st-lib/validation')
const { result_text, tally_results } = require('./t3st-lib/text')

const framework = { test, assert, affirm, result_text, tally_results }

const io = require('./t3st-lib/io')

const require_tests = require('./t3st-lib/require-tests')(io, framework)

module.exports = {
    ...framework
    , require_tests
}
