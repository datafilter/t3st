(async () => {

    const framework = require('./index')
    const show = console.log

    const framework_tests = [
        require('./tests/test_results')(framework)
      ,  require('./tests/test_test')(framework)
      ,  require('./tests/test_bool')(framework)
      ,  require('./tests/test_now')(framework)
      ,  await require('./tests/test_async')(framework)
      ,  require('./tests/assert')(framework)
      ,  require('./tests/affirm')(framework)
      ,  require('./tests/result_text')(framework)
      ,  require('./tests/tally_results')(framework)
    ]
    
    show('-'.repeat(40))
    show(framework.tally_results('framework', ...framework_tests))

})()

// todo's
// function that points to folder and runs all tests found.
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
