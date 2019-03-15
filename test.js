(async () => {

  const { require_tests } = require('./index')

  console.log('-'.repeat(40))

  require_tests('./tests', 'framework')

})()

// todo's
// Similar naming convention, wrt:
//    'strings' or "strings"
//    test names OK, ERRROR ?
// stacktrace from asserts. or rather just name & loc.
// add filename&loc to error message

// change all test throws to return 'invalid test error' instead
// more fp === more better. muuuch better.
// consolidate invald_test_message && 'type' error test message + hint ~ they signify the same thing

// remove index.js throws / uncomment & change results in index.js to find untested behaviour
