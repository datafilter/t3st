module.exports = (framework) => {

    const { test, assert, assert_fun } = framework

    const test_tests = [
        test("OK boolean body returns true result", 500 !== 43 && '5' == 5)
        , test("ERROR boolean body returns result", () => {
            const err_bool = test("_", NaN === NaN)
            assert(true, !!err_bool.error)
            assert(err_bool.error, '(false)')
        })

    ]

    return test_tests
}
