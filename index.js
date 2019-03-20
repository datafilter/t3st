const { test, assert, affirm } = require('./t3st-lib/validation')
const { result_text, tally_results } = require('./t3st-lib/text')

const framework = { test, assert, affirm, result_text, tally_results }

const io = require('./t3st-lib/io')

const run = require('./t3st-lib/run')(io, framework)

module.exports = {
    ...framework
    , run
}
