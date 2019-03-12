module.exports = (framework) => {

    const { test, assert, assert_fun } = framework

    const assert_chain_tests = [
        test("true assert returns true",
            () => assert(true, assert(true, true)))
        , test("chained assert stops at first error", () => {
            const err_third = test("_",
                () => assert(true, true) && assert(1, 1) && assert(1, 5) && assert(6, 7))
            assert('Evaluation [1] === [5]', err_third.error)
        })
    ]

    const undefined_argument_error = 'assert(?,?) missing or undefined argument(s)'

    const assert_equal_tests = [
        test("OK results from equal values", () => assert(true, true) && assert(false, false) && assert('a', 'a'))
        , test("strict assert shows type mismatch error", () => {
            const nonstrict_err = test("_", () => assert('5', 5))
            assert(true, !!nonstrict_err.error)
            assert_fun(() => nonstrict_err.error.includes('Type mismatch: assert(string, number)'))
        })
        , test("Error results for same type doesn't show type error", () => {
            const nonstrict_err = test("_", () => assert(1, 2))
            assert(true, !!nonstrict_err.error)
            assert(false, nonstrict_err.error.includes('Type mismatch: assert(string, number)'))
        })
        , test("Evaluation is included in error message", () => {
            const error_result_bool = test("err", () => assert(true, false))
            assert("Evaluation ['text'] === ['other text']", test("err", () => assert("text", `other text`)).error)
            assert_fun(() => error_result_bool.error.includes("Evaluation [true] === [false]"))
            assert_fun(() => test("err", () => assert(5, true)).error.includes("Evaluation [5] === [true]"))
        })
        , test("assert nothing or undefined returns error", () => {
            const nullary = test("_", () => assert())
            const unary = test("_", () => assert(undefined))
            const binary = test("_", () => assert(undefined, undefined))
            assert(nullary.error, unary.error)
            assert(unary.error, binary.error)
            assert_fun(() => nullary.error.includes(undefined_argument_error))
        })
        , test("assert value against undefined returns error", () => {
            const missing_2nd = test("_", () => assert("truthy?"))
            const undefined_1st = test("_", () => assert(undefined, "truthy?"))
            const undefined_2nd = test("_", () => assert("truthy?", undefined))
            assert_fun(() => missing_2nd.error.includes(undefined_argument_error))
            assert_fun(() => undefined_1st.error.includes(undefined_argument_error))
            assert_fun(() => undefined_2nd.error.includes(undefined_argument_error))
        })
    ]

    return [assert_chain_tests, assert_equal_tests]
}
