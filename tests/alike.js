module.exports = (framework) => {

    const { test, assert, affirm, alike } = framework

    const alike_chain_tests = [
        test("true alike returns true",
            () => alike(true, alike(true, true)))
        , test("chained alike stops at first error", () => {
            const err_third = test("_",
                () => alike(true, true) && alike(1, 1) && alike(1, 5) && alike(6, 7))
            affirm(err_third.error, (e) => e.includes("Evaluation [1] === [5]"))
        })
    ]

    const undefined_argument_error = 'alike(?,?) missing or undefined argument(s).'

    const alike_equal_tests = [
        test("OK results from equal values", () => alike(true, true) && alike('a', 'a'))
        , test("OK results from same data values for different objects", () => {
            const a = { type: 'aircraft', 'cost': '$4bn' }
            const b = { 'type': 'aircraft', cost: '$4bn' }
            alike(a, b)
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
            const error_result = test("err", () => alike(a, b))
            assert(true, !!error_result.error)
        })
        , test("Evaluation is included in error message", () => {
            affirm(test("err", () => alike("text", `other text`)).error,
                (e) => e.startsWith(`Evaluation ['text'] === ['other text']`))
            affirm(test("err", () => alike(true, false)).error,
                (e) => e.includes("Evaluation [true] === [false]"))
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
            const missing_2nd = test("_", () => alike("truthy"))
            const undefined_1st = test("_", () => alike(undefined, "truthy"))
            const undefined_2nd = test("_", () => alike("truthy", undefined))
            assert(undefined_argument_error, missing_2nd.error)
            assert(missing_2nd.error, undefined_1st.error)
            assert(undefined_1st.error, undefined_2nd.error)
        })
        , test("functions can be compared", () => {
            const f = x => x
            const g = x => x
            alike(f, g)
            alike(y => y, y => y)
            const error_result = test("err", () => alike(f, y => y))
            assert(true, !!error_result.error)
        })
        , test("function comparisons are character sensitive", () => {
            const a = () => 'a'
            const _a = () => '' + 'a'
            assert(a(), 'a')
            assert(a(), _a())
            assert(true, !!test("_", () => { alike(a, _a) }).error)
        })
        , test("function comparisons are spacing sensitive", () => {
            const id = new Function('x', 'return x')
            const id_nospace = new Function('x', 'return x ')
            const r1 = id(2), r2 = id_nospace(1 + 1)
            assert(r1, r2)
            assert(true, !!test("_", () => { alike(id, id_nospace) }).error)
        })
        , test("order of object members do not matter", () => {
            const name_then_age = { name: 'mark', age: 70 }
            const age_then_name = { age: 70, name: 'mark' }
            alike(name_then_age, age_then_name)
        })
        , test("can't be used for truthy assertions", () => {
            affirm(test("_", () => alike(5, '5')).error, (err) =>
                err.includes(`[5] === ['5']`))
        })
        , test("can compare against null", () => {
            alike(null, null)
            alike({ nested: { prop: null } }, { nested: { prop: null } })

            assert(true, !!test(`not an empty string`, () => alike('', null)).error)
            assert(true, !!test(`not a 'null' string`, () => alike('null', null)).error)
            assert(true, !!test("not an empty object", () => alike({}, null)).error)
            assert(true, !!test("not an empty array", () => alike([], null)).error)
        })
    ]

    return [alike_chain_tests, alike_equal_tests]
}
