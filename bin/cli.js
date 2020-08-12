#!/usr/bin/env node
(async () => {

    const parse = require('./parse')
    const conf = parse(process.argv.slice(2))

    if (conf.errors){
        console.log('Invalid t3st input')
        console.log('-'.repeat(18))
        conf.errors.forEach(e => console.log(e))
        console.log(`\nSee 't3st help'`)
        require('process').exitCode = 1
        return
    }

    if (conf.opt.help) {
        const { usage } = require('./help')
        console.log(usage)
        return
    }

    const nop = () => { }

    const display = !conf.opt.silent && console || {
        log: nop,
        time: nop,
        timeEnd: nop,
        clear: nop
    }

    conf.opt.clear && display.clear()

    display.time('elapsed')

    const fs = require('fs')
    const path = require('path')
    const { run } = require('../index.js')

    //todo man/help output

    //todo extra arg for mixed mode

    const target_dir = conf.plain[0] || 'tests'

    const entry = process.cwd()

    const test_dir = target_dir.startsWith(entry) ? target_dir : path.join(entry, target_dir)

    const run_dir = fs.existsSync(path.join(test_dir, 'package.json'))
        ? path.join(test_dir, 'tests')
        : test_dir

    display.log(`testing ${run_dir}`)
    display.log('-'.repeat(40))

    if (fs.existsSync(run_dir)) {
        const summary = await run({ test_dir: run_dir })
        display.log(summary)
    } else {
        require('../lib/io').flagExitError()
        display.log('no tests found in ' + run_dir)
    }

    display.timeEnd('elapsed')
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