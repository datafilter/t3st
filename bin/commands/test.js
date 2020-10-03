module.exports = async (display, target_dir, noisy, silent, filter) => {

    display.time('elapsed')

    const fs = require('fs')
    const path = require('path')

    const validation = require('../../lib/validation')
    const io = require('../../lib/io')
    const run = require('../../lib/run')(validation, io)

    const entry = process.cwd()

    const test_dir = target_dir.startsWith(entry) ? target_dir : path.join(entry, target_dir)

    const run_dir = fs.existsSync(path.join(test_dir, 'package.json'))
        ? path.join(test_dir, 'tests')
        : test_dir

    const test_msg = `testing ${run_dir} (${filter})`
    display.log(test_msg)
    display.log('-'.repeat(test_msg.length))

    if (fs.existsSync(run_dir)) {
        await run({
            test_dir: run_dir,
            file_filter: x => x.endsWith(filter),
            noisy,
            silent
        })
    } else {
        require('../../lib/io').flagExitError()
        display.log('Directory does not exist ' + run_dir)
    }

    display.timeEnd('elapsed')
}