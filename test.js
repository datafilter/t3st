(async () => {

  const { require_tests } = require('./index')

  console.log('-'.repeat(40))

  require_tests('./tests', 'framework')

})()

// todo's

// stacktrace from asserts. or rather just name & loc.
// add filename&loc to error message