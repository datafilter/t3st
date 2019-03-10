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
        test("includes error message of invalid assertion", () => {
            const err_false = test("_", () => assert_fun(() => mark))
            assert(true, err_false.error.includes("failed *before* assertion"))
            assert(true, err_false.error.includes("ReferenceError: mark is not defined"))
        })
        , test("expects a boolean result", () => {
            const non_boolean = test("_", () => assert_fun(() => 'truthy'))
            assert(true, !!non_boolean.error)
            assert_fun(non_boolean.error, () =>
                non_boolean.error.includes('expected assert_fun(function => boolean)'))

            assert(false, non_boolean.error.includes("failed *before* assertion"))
        })
        , test("ok assert truthy with !!", () => assert_fun(() => !!'truthy'))
        , test("includes evaluation in false assertion", () => {
            const err_false = test("_", () => assert_fun(() => 50 < 1))
            assert(err_false.error, "Evaluation[() => 50 < 1]")

            assert(false, err_false.error.includes("failed *before* assertion"))
        })
        , test("description is optional", () => assert_fun(() => true))
        , test("description can be added", () => assert_fun("something", () => true))
        , test("description is shown in error message", () => {
            const flavor = "cinnamon"
            const err_description = test("_", () => assert_fun(flavor, () => flavor == "vanilla"))
            assert(true, err_description.error.includes(flavor))
            assert(true, err_description.error.includes(`Evaluation[() => flavor == "vanilla"]`))
        })

    ]

    return [fun_chain_tests, fun_tests]
}
