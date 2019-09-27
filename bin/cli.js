#!/usr/bin/env node
(async () => {

    const [_node_exec_path, _cli_file_path, target_dir, ...args] = process.argv
    //todo test each dir passed in args

    const entry_dir = process.cwd()
    const test_dir = target_dir

    const { run } = require('../index.js')
    console.log('-'.repeat(40))
    await run({ entrypoint_dir: entry_dir, dir: test_dir })
})()

// IN PROJECT DIR
// t3st
// --> run(root/tests) [OK]
// t3st folder
// --> run(root/folder) [OK]

// OUTSIDE PROJECT DIR
// t3st
// --> no tests found.
// t3st folder
// --> run (cwd/folder/tests)
// t3st folder/tests
// --> run (cwd/folder/tests) [OK]

//TODO Walk.dir no dir found.