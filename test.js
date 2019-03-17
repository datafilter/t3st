(async () => {

  const { require_tests } = require('./index')

  console.log('-'.repeat(40))

  require_tests('./tests')

})()
