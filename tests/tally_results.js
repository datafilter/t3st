module.exports = (framework) => {

    const { test, assert, affirm } = framework

    const { tally_results } = require('../t3st-lib/text')

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
            assert(true, test_cases.every(c =>
                affirm(`{{${c}}}.startWith{{${expected_start}}}`, () => c.startsWith(expected_start))
            ))
        })
        , test("tally_results single OK result", () => {
            const expected_start = "1 test [ok] 🥦"
            const test_cases = [
                tally_results(results_single_success)
                , tally_results('', results_single_success)
                , tally_results(...results_single_success)
                , tally_results('', ...results_single_success)
            ]
            assert(true, test_cases.every(c =>
                affirm(c, expected_start, (c, expected_start) => c.startsWith(expected_start))
            ))
        })
        , test("tally_results adds label", () => {
            const expected_start = "Label test"
            const test_cases = [
                tally_results('Label test')
                , tally_results('Label test', results_empty)
                , tally_results('Label test', results_single_success)
                , tally_results('Label test', ...results_empty)
                , tally_results('Label test', ...results_single_success)
            ]
            assert(true, test_cases.every(c =>
                affirm(`{{${c}}}.startWith{{${expected_start}}}`, () => c.startsWith(expected_start))
            ))
        })
        , test("detect non test-results", () => {
            const valid_results = [
                { description: "test name" }
                , { description: "test2", error: "details" }
                , { description: 3 }
                , { description: (a) => a * a }
                , { description: 0, error: 0 }
            ]
            assert(true, valid_results.every(c =>
                affirm(tally_results([c]), (tally) => !tally.includes('Not a test result'))))

            const non_results = [{}, 5, "some", null, { error: "no description" }, Promise.resolve(1)]
            assert(true, non_results.every(c =>
                affirm(tally_results([c]), (tally) => tally.includes('Not a test result'))))
        })
        , test("Tests with errors from thrown falsey values are tallied as errors", () => {
            const falseys = [false, '', 0, NaN, null, undefined]
            const falsey_results = falseys.map(v => test('', () => { throw v }))
            const mixed_results = [...falsey_results, { description: '' }]
            const mixed_2_ok = [...mixed_results, { description: 'na' }]

            affirm(tally_results(falsey_results), o => o.includes('0 tests [ok] ..and 6 [errors]'))
            affirm(tally_results(mixed_results), o => o.includes('1 test [ok] ..and 6 [errors]'))
            affirm(tally_results(mixed_2_ok), o => o.includes('2 tests [ok] ..and 6 [errors]'))
        })
    ]

    return tally_results_tests
}