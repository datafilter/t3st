(async () => {

  const { require_tests } = require('./index')

  console.log('-'.repeat(40))

  require_tests('./tests', 'framework')

})()

// todo's

// complete tests for error origin : (filename&loc to error messages)

// test error.includes helper function or create alternative