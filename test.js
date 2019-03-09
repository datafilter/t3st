(async () => {

    const framework = require('./index')
    const show = console.log

    const test_results = require('./tests/test_results')(framework)
    const tally_results_tests = require('./tests/tally_results')(framework)

    const framework_tests = [test_results, tally_results_tests]

    show('-'.repeat(40))
    show(framework.tally_results('framework', ...framework_tests))

})()
