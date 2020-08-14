const validation = require('./lib/validation')

const io = require('./lib/io')

const { summize } = require('./lib/text')

const run = require('./lib/run')(validation, io, summize)

module.exports = {
    ...validation
    , run
}
