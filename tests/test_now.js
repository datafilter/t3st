module.exports = ({ test, equal }) => {
    return [
        test("OK test passed with empty body", () => { })
        , test("Function that returns false is OK test", () => false)
        , test("Additional arguments are ignored", () => undefined, () => equal(true, false))
        , test("Error is caught and returned verbatim", () => {
            const number_error = test("_", () => { throw 7 })
            equal(number_error.error, 7)

            const ref_brr = {}
            const ref_thrown = test("_", () => { throw ref_brr })

            equal(true, {} !== {})
            equal(ref_thrown.error, ref_brr)
        })
        , test("Falsey thrown values are caught as errors", () => {
            const falseys = [false, '', 0, NaN, null, undefined]
            equal(true, falseys.every(f => !f))

            const tests = falseys.map(v => { return test("_", () => { throw v }) })

            equal(true, tests.every(result => ('error' in result)))
            equal(true, tests.every(result => !!result.trace))
        })
    ]
}