module.exports = (framework) => {

    const { test, assert_fun, tally_results } = framework

    const results_empty = []
    const results_single_success = [{ description: "mkay fine" }]

    const tally_results_tests = [
        test("tally_results empty results", () => {
            const expected_start = "0 tests [ok] 🥦"
            const test_cases = [
                tally_results()
                , tally_results([])
                , tally_results([[]])
                , tally_results([[[]]])
                , tally_results('')
                , tally_results(results_empty)
                , tally_results('', results_empty)
                , tally_results(...results_empty)
                , tally_results('', ...results_empty)
            ]
            test_cases.forEach(c => {
                assert_fun(`{{${c}}}.startWith{{${expected_start}}}`, () => c.startsWith(expected_start))
            })
        }),
        test("tally_results single OK result", () => {
            const expected_start = "1 test [ok] 🥦"
            const test_cases = [
                tally_results(results_single_success)
                , tally_results('', results_single_success)
                , tally_results(...results_single_success)
                , tally_results('', ...results_single_success)
            ]
            test_cases.forEach(c => {
                assert_fun(`{{${c}}}.startWith{{${expected_start}}}`, () => c.startsWith(expected_start))
            })
        }),
        test("tally_results adds label", () => {
            const expected_start = "Label test"
            const test_cases = [
                tally_results('Label test')
                , tally_results('Label test', results_empty)
                , tally_results('Label test', results_single_success)
                , tally_results('Label test', ...results_empty)
                , tally_results('Label test', ...results_single_success)
            ]
            test_cases.forEach(c => {
                assert_fun(`{{${c}}}.startWith{{${expected_start}}}`, () => c.startsWith(expected_start))
            })
        })
    ]

    return tally_results_tests
}