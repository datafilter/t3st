#!/usr/bin/env node
(async () => {

    const clia = require('clia')
    const conf = clia(process.argv.slice(2), ['silent'])

    const nop = () => { }

    const display = !conf.opt.silent && console || {
        log: nop,
        time: nop,
        timeEnd: nop
    }

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