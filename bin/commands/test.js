module.exports = async (display, target_dir, verbose) => {

    display.time('elapsed')

    const fs = require('fs')
    const path = require('path')
    const { run } = require('../../index.js')

    const entry = process.cwd()

    const test_dir = target_dir.startsWith(entry) ? target_dir : path.join(entry, target_dir)

    const run_dir = fs.existsSync(path.join(test_dir, 'package.json'))
        ? path.join(test_dir, 'tests')
        : test_dir

    const test_msg = `testing ${run_dir}`
    display.log(test_msg)
    display.log('-'.repeat(test_msg.length))

    if (fs.existsSync(run_dir)) {
        const summary = await run({ test_dir: run_dir, verbose })
        display.log(summary)
    } else {
        require('../../lib/io').flagExitError()
        display.log('no tests found in ' + run_dir)
    }

    display.timeEnd('elapsed')
}