(async () => {

  console.time('elapsed')

  const { run } = require('./index')

  console.log('-'.repeat(40))

  const path = require('path')
  const test_dir = path.join(path.dirname(require.main.filename),'tests')
  const play_dir = path.join(path.dirname(require.main.filename),'play')

  await run({ test_dir: test_dir, label: 'framework' })
  await run({ test_dir: play_dir, label: 'play' })
  
  console.timeEnd('elapsed')

})()
