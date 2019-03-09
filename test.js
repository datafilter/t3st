(async () => {

    const framework = require('./index')
    const show = console.log

    // todo function that points to folder and runs all tests.

    const framework_tests = [
        require('./tests/test_results')(framework),
        require('./tests/test')(framework),
        require('./tests/assert')(framework),
        require('./tests/tally_results')(framework)
    ]

    show('-'.repeat(40))
    show(framework.tally_results('framework', ...framework_tests))

})()
