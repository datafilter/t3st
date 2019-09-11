const validation = require('./t3st-lib/validation')

const { tally_results } = require('./t3st-lib/text')

const io = require('./t3st-lib/io')

const run = require('./t3st-lib/run')(io, validation, tally_results)

module.exports = {
    ...validation
    , run
}
