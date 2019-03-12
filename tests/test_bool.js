module.exports = (framework) => {

    const { test, assert, affirm } = framework

    const test_tests = [
        test("OK boolean body returns true result", 500 !== 43 && '5' == 5)
        , test("ERROR boolean body returns result", () => {
            const err_bool = test("_", NaN === NaN)
            assert(true, !!err_bool.error)
            assert(err_bool.error, '(false)')
        })
        , test("OK boolean body runs continuation", () => {
            const resumed_test = test("_", true, () => { throw '~err~' })
            assert(true, !!resumed_test.error)
            assert('~err~', resumed_test.error)
        })
        , test("Error boolean body stops immediately", () => {
            const stopped_test = test("_", false, () => { throw '~err~' })
            assert(true, !!stopped_test.error)
            assert('(false)', stopped_test.error)
        })
    ]

    return test_tests
}
