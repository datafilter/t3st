module.exports = (framework) => {

    const { test, assert, assert_fun } = framework

    const fun_chain_tests = [
        test("true assert returns true", () =>
            assert(true, assert_fun(() => true))
        )
        , test("chained assert stops at first error", () => {
            const err_third = test("_", () =>
                assert_fun(() => true)
                && assert_fun(() => 1 === 1)
                && assert_fun(() => 1 === 5)
                && assert_fun(() => 6 === 7)
            )
            assert('Evaluation[() => 1 === 5]', err_third.error)
        })
    ]

    const fun_tests = [

    ]

    return [fun_chain_tests, fun_tests]
}
