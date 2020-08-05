#!/usr/bin/env node
(async () => {

    const [_node_exec_path, _cli_file_path, maybe_cli_dir, maybe_option, _other_cli_args] = process.argv

    // todo use clia instead, as this logic doesn't account for -stuvwxyz or --silent=true etc
    const opt_silent = maybe_option === '-s' || maybe_option === '--silent' ||
        (!maybe_option && (maybe_cli_dir === '-s' || maybe_cli_dir === '--silent'))

    if (!opt_silent)
        console.time('elapsed')

    const fs = require('fs')
    const path = require('path')
    const { run } = require('../index.js')

    //todo man/help output

    //todo extra arg for mixed mode

    // todo use clia instead, as this logic doesn't account for -stuvwxyz or --silent=true etc
    const target_dir = maybe_cli_dir !== '-s' && maybe_cli_dir !== '--silent' && maybe_cli_dir || 'tests'

    const entry = process.cwd()

    const test_dir = target_dir.startsWith(entry) ? target_dir : path.join(entry, target_dir)

    const run_dir = fs.existsSync(path.join(test_dir, 'package.json'))
        ? path.join(test_dir, 'tests')
        : test_dir

    if (!opt_silent) {
        console.log(`testing ${run_dir}`)
        console.log('-'.repeat(40))
    }

    if (fs.existsSync(run_dir)) {
        const summary = await run({ test_dir: run_dir })
        if (!opt_silent)
            console.log(summary)
    } else {
        require('../lib/io').flagExitError()
        if (!opt_silent)
            console.log('no tests found in ' + run_dir)
    }

    if (!opt_silent)
        console.timeEnd('elapsed')
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