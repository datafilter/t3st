module.exports = ({ test, equal, check }) => {

    const equal_chain_tests = [
        test("true equal returns true",
            () => equal(true, equal(true, true)))
        , test("chained equal stops at first error", () => {
            const err_third = test("_",
                () => equal(true, true) && equal(1, 1) && equal(1, 5) && equal(6, 7))
            check(err_third.error, (e) => e.message.includes("Evaluation [1] === [5]"))
        })
    ]

    const undefined_argument_error = 'equal(?,?) missing or undefined argument(s).'

    const equal_equal_tests = [
        test("OK results from equal values", () => equal(true, true) && equal('a', 'a'))
        , test("OK results from same data values for different objects", () => {
            const a = { type: 'aircraft', 'cost': '$4bn' }
            const b = { 'type': 'aircraft', cost: '$4bn' }
            equal(a, b)
        })
        , test("Error results from different data values", () => {
            const a = { 'type': 'boat', 'cost': '$250k' }
            const b = {
                'type': 'submarine',
                'cost': '$8bn',
                add: (x, y) => x + y, num: 4, bool: false, boolstring: 'false',
                'sub-thing': {
                    subby: {
                        sub: {
                            a: 1,
                            'b-x2': 'two'
                        }
                    }
                }
            }
            const error_result = test("err", () => equal(a, b))
            equal(true, !!error_result.trace)
        })
        , test("Evaluation is included in error message", () => {
            check(test("err", () => equal("text", `other text`)).error,
                (e) => e.message.startsWith(`Evaluation ['text'] === ['other text']`))
            check(test("err", () => equal(true, false)).error,
                (e) => e.message.includes("Evaluation [true] === [false]"))
        })
        , test("equal nothing or undefined returns error", () => {
            const nullary = test("_", () => equal())
            const unary = test("_", () => equal(undefined))
            const binary = test("_", () => equal(undefined, undefined))
            equal(true, nullary.error.message.startsWith(undefined_argument_error))
            equal(nullary.error.message, unary.error.message)
            equal(unary.error.message, binary.error.message)
        })
        , test("equal value against undefined returns error", () => {
            const missing_2nd = test("_", () => equal("truthy"))
            const undefined_1st = test("_", () => equal(undefined, "truthy"))
            const undefined_2nd = test("_", () => equal("truthy", undefined))
            equal(true, missing_2nd.error.message.startsWith(undefined_argument_error))
            equal(missing_2nd.error.message, undefined_1st.error.message)
            equal(undefined_1st.error.message, undefined_2nd.error.message)
        })
        , test("functions can be compared", () => {
            const f = x => x
            const g = x => x
            equal(f, g)
            equal(y => y, y => y)
            const error_result = test("err", () => equal(f, y => y))
            equal(true, !!error_result.trace)
        })
        , test("function comparisons are character sensitive", () => {
            const a = () => 'a'
            const _a = () => '' + 'a'
            equal(a(), 'a')
            equal(a(), _a())
            equal(true, !!test("_", () => { equal(a, _a) }).trace)
        })
        , test("function comparisons are spacing sensitive", () => {
            const id = new Function('x', 'return x')
            const id_nospace = new Function('x', 'return x ')
            const r1 = id(2), r2 = id_nospace(1 + 1)
            equal(r1, r2)
            equal(true, !!test("_", () => { equal(id, id_nospace) }).trace)
        })
        , test("order of object members do not matter", () => {
            const name_then_age = { name: 'mark', age: 70 }
            const age_then_name = { age: 70, name: 'mark' }
            equal(name_then_age, age_then_name)
        })
        , test("can't be used for truthy equalions", () => {
            check(test("_", () => equal(5, '5')).error.message, (m) =>
                m.includes(`[5] === ['5']`))
        })
        , test("can compare against null", () => {
            equal(null, null)
            equal({ nested: { prop: null } }, { nested: { prop: null } })

            equal(true, !!test(`not an empty string`, () => equal('', null)).trace)
            equal(true, !!test(`not a 'null' string`, () => equal('null', null)).trace)
            equal(true, !!test("not an empty object", () => equal({}, null)).trace)
            equal(true, !!test("not an empty array", () => equal([], null)).trace)
        })
    ]

    return [equal_chain_tests, equal_equal_tests]
}
