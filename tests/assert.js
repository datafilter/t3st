module.exports = (framework) => {

    const { test, assert, affirm } = framework

    const assert_chain_tests = [
        test("true assert returns true",
            () => assert(true, assert(true, true)))
        , test("chained assert stops at first error", () => {
            const err_third = test("_",
                () => assert(true, true) && assert(1, 1) && assert(1, 5) && assert(6, 7))
            affirm(err_third.error, (e) => e.includes('Evaluation [1] === [5]'))
        })
    ]

    const undefined_argument_error = 'assert(?,?) missing or undefined argument(s)'

    const assert_equal_tests = [
        test("OK results from equal values", () => assert(true, true) && assert(false, false) && assert('a', 'a'))
        , test("strict assert shows type mismatch error", () => {
            const nonstrict_err = test("_", () => assert('5', 5))
            assert(true, !!nonstrict_err.error)
            affirm(() => nonstrict_err.error.includes('Type mismatch: assert(string, number)'))
        })
        , test("ERROR results for same type doesn't show type error", () => {
            const nonstrict_err = test("_", () => assert(1, 2))
            assert(true, !!nonstrict_err.error)
            assert(false, nonstrict_err.error.includes('Type mismatch: assert(string, number)'))
        })
        , test("Evaluation is included in error message", () => {
            const error_result_bool = test("err", () => assert(true, false))
            assert(true, test("err", () => assert("text", `other text`)).error.startsWith("Evaluation ['text'] === ['other text']"))
            affirm(() => error_result_bool.error.includes("Evaluation [true] === [false]"))
            affirm(() => test("err", () => assert(5, true)).error.includes("Evaluation [5] === [true]"))
        })
        , test("assert nothing or undefined returns error", () => {
            const nullary = test("_", () => assert())
            const unary = test("_", () => assert(undefined))
            const binary = test("_", () => assert(undefined, undefined))
            affirm(() => nullary.error.includes(undefined_argument_error))
            affirm(() => unary.error.includes(undefined_argument_error))
            affirm(() => binary.error.includes(undefined_argument_error))
        })
        , test("assert value against undefined returns error", () => {
            const missing_2nd = test("_", () => assert("truthy?"))
            const undefined_1st = test("_", () => assert(undefined, "truthy?"))
            const undefined_2nd = test("_", () => assert("truthy?", undefined))
            affirm(() => missing_2nd.error.includes(undefined_argument_error))
            affirm(() => undefined_1st.error.includes(undefined_argument_error))
            affirm(() => undefined_2nd.error.includes(undefined_argument_error))
        })
        , test("error in assert is caught in test before it's passed to assert", () => {
            const err_assert = test("_", () => assert(1, not_defined))
            affirm(err_assert.error + '', (e) => e.includes('not_defined is not defined'))

            const test_err = test("_", () => not_defined)
            affirm(test_err.error + '', err_assert.error + '', (t, e) => t === e)
        })
        , test("failed assert object compare suggests alike function", () => {
            const mark1 = { name: 'mark' }
            const mark2 = { name: 'mark' }
            assert(mark1, mark1)
            assert(mark2, mark2)
            const err_assert = test("_", () => assert(mark1, mark2))
            affirm(() => err_assert.error.includes('use : alike(data, data'))
        })
    ]

    return [assert_chain_tests, assert_equal_tests]
}
