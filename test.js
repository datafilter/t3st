(async () => {

  const { require_tests } = require('./index')

  console.log('-'.repeat(40))

  require_tests('./tests', 'framework')

})()

// todo's
// Within test itself, and all  assert variants? -> Test failed *before* assertion
// Similar naming convention, wrt:
//    'strings' or "strings"
//    test names OK, ERRROR ?
// test assert(undefined_variable) assert( some other error?) -> caught in test()
// stacktrace from asserts. or rather just name & loc.
// add filename&loc to error message
// remove index.js throws / uncomment & change results in index.js to find untested behaviour
// change all test throws to return 'invalid test error' instead
// replace .forEach with .every
// more fp === more better. muuuch better.
// consolidate invald_test_message && 'type' error test message + hint ~ they signify the same thing
