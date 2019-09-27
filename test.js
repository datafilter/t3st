(async () => {

  const { run } = require('./index')

  console.log('-'.repeat(40))

  await run({ dir: 'tests', label: 'framework' })
  // await run({ dir: 'play', label: 'play' })
  // await run()

})()
