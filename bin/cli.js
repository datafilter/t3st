#!/usr/bin/env node
(async () => {

    const [_node_exec_path, _cli_file_path, maybe_cli_dir, _other_cli_args] = process.argv

    // todo if(not -s or --silent args)
    console.time('elapsed')

    const fs = require('fs')
    const path = require('path')
    const { run } = require('../index.js')

    //todo man/help output

    //todo extra arg for mixed mode

    const target_dir = maybe_cli_dir || 'tests'

    const entry = process.cwd()

    const test_dir = target_dir.startsWith(entry) ? target_dir : path.join(entry, target_dir)

    const run_dir = fs.existsSync(path.join(test_dir, 'package.json'))
        ? path.join(test_dir, 'tests')
        : test_dir

    // todo if(not -s or --silent args)
    console.log(`testing ${run_dir}`)
    console.log('-'.repeat(40))

    if (fs.existsSync(run_dir)) {
        await run({ test_dir: run_dir })
    } else {
        require('../lib/io').flagExitError()
        // todo if(not -s or --silent args)
        console.log('no tests found in ' + run_dir)
    }

    // todo if(not -s or --silent args)
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