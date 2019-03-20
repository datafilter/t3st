(async () => {

  const { run } = require('./index')
  
  console.log('-'.repeat(40))
  
  await run('./tests', { label: 'framework' })
  // await run('./play', { label: 'play' })

})()
