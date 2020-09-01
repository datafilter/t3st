module.exports = ({ test, equal, affirm }) => {

    const { summize } = require('../lib/text')

    const results_empty = []
    const results_single_success = [{ description: "mkay fine" }]

    const summize_tests = [
        test("summize empty results", () => {
            const expected_start = "0 tests [ok] 🥦"
            const test_cases = [
                summize()
                , summize([])
                , summize([[]])
                , summize([[[]]])
                , summize(results_empty)
                , summize(...results_empty)
            ]

            equal(true, test_cases.every(report =>
                affirm(report, expected_start, (r, e) => r.startsWith(e))))
        })
        , test("summize single OK result", () => {
            const expected_start = "1 test [ok] 🥦"
            const test_cases = [
                summize(results_single_success)
            ]
            equal(true, test_cases.every(c =>
                affirm(c, expected_start, (c, expected_start) => c.startsWith(expected_start))
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
            equal(true, valid_results.every(c =>
                affirm(summize([c]), (report) => !report.includes('Not a test result'))))

            const non_results = [{}, 5, "some", null, { error: "no description" }, Promise.resolve(1)]
            equal(true, non_results.every(c =>
                affirm(summize([c]), (report) => report.includes('Not a test result'))))
        })
        , test("Tests with errors from thrown falsey values are tallied as errors", () => {
            const falseys = [false, '', 0, NaN, null, undefined]
            const falsey_results = falseys.map(v => test('', () => { throw v }))
            const mixed_results = [...falsey_results, { description: '' }]
            const mixed_2_ok = [...mixed_results, { description: 'na' }]

            affirm(summize(falsey_results), o => o.includes('0 tests [ok] ..and 6 [errors]'))
            affirm(summize(mixed_results), o => o.includes('1 test [ok] ..and 6 [errors]'))
            affirm(summize(mixed_2_ok), o => o.includes('2 tests [ok] ..and 6 [errors]'))
        })
    ]

    return summize_tests
}