module.exports = (framework) => {

    const { test, assert, affirm } = framework

    const now_tests = [
        test("OK test passed with empty body", () => { })
        , test("Function that returns false is OK test", () => false)
        , test("OK runs continuation", () => 'five', (f) => assert('five', f))
        , test("ERROR stops continuation", () => {
            const non_continue = test("_", () => errr, (_na) => true)
            affirm(non_continue.error + '', (err) => err.includes('errr is not defined'))
        })
        , test("Error is caught and returned verbatim", () => {
            const number_error = test("_", () => { throw 7 })
            assert(number_error.error, 7)

            const ref_brr = {}
            const ref_thrown = test("_", () => { throw ref_brr })

            assert(true, {} !== {})
            assert(ref_thrown.error, ref_brr)
        })
        , test("Falsey thrown values are caught as errors", () => {
            const falseys = [false, '', 0, NaN, null, undefined]
            assert(true, falseys.every(f => !f))

            const tests = falseys.map(v => { return test("_", () => { throw v }) })

            assert(true, tests.every(result => ('error' in result)))
            assert(true, tests.every(result => result.hasOwnProperty('error')))

            // invalid assert example:
            // comparing .error to undefined is invalid, when a thrown error is 'undefined'
            // assert(true, tests.every(result => typeof (result.error) !== 'undefined'))
        })
    ]

    return now_tests
}
