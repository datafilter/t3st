module.exports = (framework) => {

    const { test, assert, affirm, alike } = framework

    const alike_chain_tests = [
        test("true alike returns true",
            () => alike(true, alike(true, true)))
        , test("chained alike stops at first error", () => {
            const err_third = test("_",
                () => alike(true, true) && alike(1, 1) && alike(1, 5) && alike(6, 7))
            affirm(err_third.error, (e) => e.includes("Evaluation ['1'] === ['5']"))
        })
    ]

    const undefined_argument_error = 'alike(?,?) missing or undefined argument(s).'

    const alike_equal_tests = [
        test("OK results from equal values", () => alike(true, true) && alike('a', 'a'))
        , test("OK results form same data values", () => {
            const a = { 'type': 'aircraft', 'cost': '$4bn' }
            const b = { 'type': 'aircraft', 'cost': '$4bn' }
            alike(a, b)
        })
        , test("Evaluation is included in error message", () => {
            affirm(test("err", () => alike("text", `other text`)).error, (e) => e.startsWith(`Evaluation ['text'] === ['other text']`))
            const error_result_bool = test("err", () => alike(true, false))
            affirm(error_result_bool.error, (e) => e.includes("Evaluation ['true'] === ['false']"))
        })
        , test("alike nothing or undefined returns error", () => {
            const nullary = test("_", () => alike())
            const unary = test("_", () => alike(undefined))
            const binary = test("_", () => alike(undefined, undefined))
            assert(undefined_argument_error, nullary.error)
            assert(nullary.error, unary.error)
            assert(unary.error, binary.error)
        })
        , test("alike value against undefined returns error", () => {
            const missing_2nd = test("_", () => alike("truthy?"))
            const undefined_1st = test("_", () => alike(undefined, "truthy?"))
            const undefined_2nd = test("_", () => alike("truthy?", undefined))
            assert(undefined_argument_error, missing_2nd.error)
            assert(missing_2nd.error, undefined_1st.error)
            assert(undefined_1st.error, undefined_2nd.error)
        })
        , test("functions and data can be compared", () => {
            const a = x => x
            const b = x => x
            alike(a, b)
            alike({}, {})
            alike({ name: 'mark', f: a }, { name: 'mark', f: x => x })
        })
        , test("function comparisons are spacing sensitive", () => {
            const a = () => 'a'
            const b = () => '' + 'a' // x=>x !=== x => x , however auto-format kills this as a test.
            assert(true, !!test("_", () => { alike(a, b) }).error)
        })
        , test("order of object members do not matter", () => {
            const name_then_age = { name: 'mark', age: 70 }
            const age_then_name = { age: 70, name: 'mark' }
            alike(name_then_age, age_then_name)
        })
    ]

    return [alike_chain_tests, alike_equal_tests]
}
