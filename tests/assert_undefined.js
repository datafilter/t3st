module.exports = ({ test, assert, affirm }) => [
    test("assert undefined suggests assert.undefined function", _ => {
        const undefined_error = test('', _ => {
            const u = {}.nothing
            assert(1, u)
        })
        affirm(undefined_error.error, (e) => e.includes("assert.undefined"))
    })
    , test("ok from undefined values", _ => {
        const r = test('', _ => {
            assert.undefined()
        })
        affirm(r.error, (e) => e.includes('argument'))
    })
    , test("error from defined values includes type", _ => {
        let u = 1
        const num = test('', _ => assert.undefined(u))
        affirm(num.error, (e) => e.includes('number') && e.includes(1))

        const str = test('', _ => assert.undefined('undefined'))
        affirm(str.error, (e) => e.includes('string') && e.includes(`'undefined'`))

        const obj = test('', _ => assert.undefined({ name: 'mark' }))
        affirm(obj.error, (e) => e.includes('object') && e.includes(`"name":"mark"`))
    })
]
