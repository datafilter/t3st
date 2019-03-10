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
        test("expects a boolean result", () => {
            let non_boolean = test("_", () => assert_fun(() => 'truthy'))
            assert(true, !!non_boolean.error)
        })
        , test("ok assert truthy with !!", () => assert_fun(() => !!'truthy'))

    ]

    return [fun_chain_tests, fun_tests]
}

// todo: 
// throw 'Expected assert_fun(function => boolean) gives invalid (Test failed *before* assertion)
//   