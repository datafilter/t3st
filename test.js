(async () => {

  const { require_tests } = require('./index')

  console.log('-'.repeat(40))

  await require_tests('./tests')

})()
