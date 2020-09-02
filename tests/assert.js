module.exports = ({ test, throws, equal, affirm }) => {

    const equal_chain_tests = [
        test("true equal returns true",
            () => equal(true, equal(true, true)))
        , test("chained equal stops at first error", () => {
            const err_third = test("_",
                () => equal(true, true) && equal(1, 1) && equal(1, 5) && equal(6, 7))
            affirm(err_third.error.message, (m) => m.includes('Evaluation [1] === [5]'))
        })
    ]

    const undefined_argument_error = 'equal(?,?) missing or undefined argument(s)'

    const equal_equal_tests = [
        test("OK results from equal values", () => equal(true, true) && equal(false, false) && equal('a', 'a'))
        , throws("strict equal shows type mismatch error", () => {
            equal('5', 5)
        }, (err) => {
            affirm(err.message, (m) => m.includes('Type mismatch: equal(string, number)'))
        })
        , test("ERROR results for same type doesn't show type error", () => {
            const nonstrict_err = test("_", () => equal(1, 2))
            equal(true, !!nonstrict_err.trace)
            equal(false, nonstrict_err.error.message.includes('Type mismatch: equal(string, number)'))
        })
        , test("Evaluation is included in error message", () => {
            affirm(test("err", () => equal(true, false)).error.message, (m) =>
                m.includes("Evaluation [true] === [false]"))
            affirm(test("err", () => equal(true, 'true')).error.message, (m) =>
                m.includes("Evaluation [true] === ['true']"))
            affirm(test("err", () => equal("text", `other text`)).error.message, (m) =>
                m.startsWith("Evaluation ['text'] === ['other text']"))
            affirm(test("err", () => equal(5, true)).error.message, (m) =>
                m.includes("Evaluation [5] === [true]"))
        })
        , test("equal nothing or undefined returns error", () => {
            const nullary = test("_", () => equal())
            const unary = test("_", () => equal(undefined))
            const binary = test("_", () => equal(undefined, undefined))
            affirm(() => nullary.error.message.includes(undefined_argument_error))
            affirm(() => unary.error.message.includes(undefined_argument_error))
            affirm(() => binary.error.message.includes(undefined_argument_error))
        })
        , test("equal value against undefined returns error", () => {
            const missing_2nd = test("_", () => equal("truthy"))
            const undefined_1st = test("_", () => equal(undefined, "truthy"))
            const undefined_2nd = test("_", () => equal("truthy", undefined))
            affirm(() => missing_2nd.error.message.includes(undefined_argument_error))
            affirm(() => undefined_1st.error.message.includes(undefined_argument_error))
            affirm(() => undefined_2nd.error.message.includes(undefined_argument_error))
        })
        , test("error in equal is caught in test before it's passed to equal", () => {
            const err_equal = test("_", () => equal(1, (() => { throw 'iife throw' })()))
            equal(err_equal.error + '', 'iife throw')

            const test_err = test("_", () => (() => { throw 'iife throw' })())
            affirm(test_err.error + '', err_equal.error + '', (t, e) => t === e)
        })
    ]

    return [equal_chain_tests, equal_equal_tests]
}
