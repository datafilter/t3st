module.exports = ({ test, equal, check }) => [
    test("equal undefined suggests equal.undefined function", _ => {
        const undefined_error = test('', _ => {
            const u = {}.nothing
            equal(1, u)
        })
        check(undefined_error.error.message, (m) => m.includes("equal.undefined"))
    })
    , test("ok from undefined values", _ => {
        const u = {}.nothing
        const r = test('', _ => {
            equal.undefined(u)
        })
        equal(false, !!r.trace)
        equal.undefined()
    })
    , test("error from defined values includes type", _ => {
        const u = 1
        const num = test('', _ => equal.undefined(u))
        check(num.error.message, (m) => m.includes('number') && m.includes(1))

        const str = test('', _ => equal.undefined('undefined'))
        check(str.error.message, (m) => m.includes('string') && m.includes(`'undefined'`))

        const obj = test('', _ => equal.undefined({ name: 'mark' }))
        check(obj.error.message, (m) => m.includes('object') && m.includes(`"name":"mark"`))
    })
]
