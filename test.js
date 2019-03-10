(async () => {

    const framework = require('./index')
    const show = console.log

    const framework_tests = [
        require('./tests/test_results')(framework)
      ,  require('./tests/test_test')(framework)
      ,  require('./tests/test_now')(framework)
      ,  await require('./tests/test_async')(framework)
      ,  require('./tests/assert')(framework)
      ,  require('./tests/assert_fun')(framework)
      ,  require('./tests/assert_eval')(framework)
      ,  require('./tests/result_text')(framework)
      ,  require('./tests/tally_results')(framework)
    ]
    
    show('-'.repeat(40))
    show(framework.tally_results('framework', ...framework_tests))

})()

// todo's
// function that points to folder and runs all tests found.
// stacktrace from asserts.
// empty test name error or default
// missing test code error
// Within test itself, and all asserts? -> Test failed *before* assertion
// Similar naming convention, wrt:
//  'strings' or "strings"
//  test names OK, ERRROR ?
// test assert(undefined_variable) assert( some other error?) -> caught in test()