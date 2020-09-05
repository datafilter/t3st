const validation = require('./lib/validation')

const io = require('./lib/io')

const run = require('./lib/run')(validation, io)

module.exports = {
    ...validation
    , run
}
