module.exports = ({ test, throws, equal, check }) => [
    throws("equal undefined suggests equal.undefined function",
        () => equal(1, {}.nothing)
        , err => check(err.message, (m) => m.includes("equal.undefined"))
    )
    , test("ok from undefined values", _ => {
        const u = {}.nothing
        equal.undefined(u)
        equal.undefined()
    })
    , test("error from defined values includes type", _ => {
        const num_error = throws(() => equal.undefined(1))
        check(num_error.message, (m) => m.includes('number') && m.includes(1))

        const str_error = throws(() => equal.undefined('undefined'))
        check(str_error.message, (m) => m.includes('string') && m.includes(`'undefined'`))

        const obj_error = throws(() => equal.undefined({ name: 'mark' }))
        check(obj_error.message, (m) => m.includes('object') && m.includes(`"name": "mark"`))
    })
]
