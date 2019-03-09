(async () => {

    const framework = require('./index')
    const show = console.log

    const tally_results_tests = require('./tests/tally_results')(framework)

    const framework_tests = tally_results_tests

    show('-'.repeat(40))
    show(framework.tally_results('framework', ...framework_tests))

})()
