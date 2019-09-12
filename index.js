const validation = require('./t3st-lib/validation')

const io = require('./t3st-lib/io')

const { tally_results } = require('./t3st-lib/text')

const run = require('./t3st-lib/run')(validation, io, tally_results)

module.exports = {
    ...validation
    , run
}
