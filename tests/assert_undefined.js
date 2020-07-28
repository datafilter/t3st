module.exports = ({ test, assert, affirm }) => [
    test("assert undefined suggests assert.undefined function", _ => {
        const undefined_error = test('', _ => {
            const u = {}.nothing
            assert(1, u)
        })
        affirm(undefined_error.error.message, (m) => m.includes("assert.undefined"))
    })
    , test("ok from undefined values", _ => {
        const u = {}.nothing
        const r = test('', _ => {
            assert.undefined(u)
        })
        assert(false, !!r.trace)
        assert.undefined()
    })
    , test("error from defined values includes type", _ => {
        const u = 1
        const num = test('', _ => assert.undefined(u))
        affirm(num.error.message, (m) => m.includes('number') && m.includes(1))

        const str = test('', _ => assert.undefined('undefined'))
        affirm(str.error.message, (m) => m.includes('string') && m.includes(`'undefined'`))

        const obj = test('', _ => assert.undefined({ name: 'mark' }))
        affirm(obj.error.message, (m) => m.includes('object') && m.includes(`"name":"mark"`))
    })
]
