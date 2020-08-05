const validation = require('./lib/validation')

const io = require('./lib/io')

const { tally_results } = require('./lib/text')

const run = require('./lib/run')(validation, io, tally_results)

module.exports = {
    ...validation
    , run
}
