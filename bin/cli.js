#!/usr/bin/env node
(async () => {

    const parse = require('./parse')
    const conf = parse(process.argv.slice(2))

    const nop = () => { }
    const display = !conf.opt.silent && console || {
        log: nop,
        time: nop,
        timeEnd: nop,
        clear: nop
    }

    if (conf.errors) {
        display.log('Invalid t3st input')
        display.log('-'.repeat(18))
        conf.errors.forEach(e => display.log(e))
        display.log(`\nSee 't3st help'`)
        process.exitCode = 1
        return
    }

    if (conf.opt.version) {
        const pkg = require('../package.json')
        console.log(pkg.version)
        return
    }

    conf.opt.clear && display.clear()

    if (conf.arg.watch_mode) {
        const watch_header = require('./commands/watch_msg')
        console.log(watch_header)
        console.log('-'.repeat(watch_header.length))
    }

    if (conf.command.test) {

        const test = require('./commands/test')

        const target_dir = conf.arg.dir || 'tests'
        const noisy = conf.opt.noisy || false
        const filter = conf.arg.filter || '.js'

        await test(display, target_dir, noisy, conf.opt.silent, filter)
    }
    else if (conf.command.watch) {
        require('./commands/watch')(conf)
    }
    else if (conf.command.help) {
        require('./commands/help')(conf.arg.help)
    }
    else if (conf.command.gen) {
        require('./commands/gen')(display, conf.arg.gen, conf.opt.ref)
    }
    else if (conf.command.x) {
        const isWin = require('os').platform() === 'win32'
        if (isWin)
            console.log(`nodemon -q -x "node bin\\cli.js -c --watch_mode=true"`)
        else console.log(`nodemon -q -x 'node bin/cli.js -c --watch_mode=true'`)
    }

})()

// TODO, don't recursively walk dir if any have package.json, stop going down that path.
// for example
// projects         <- here, stop
// |
// | - zest         <- t3st zest/tests
// |   | - tests    <- t3st zest/tests
// |   | - stuff
// | - other
// |   | - tests
// |   | - stuff