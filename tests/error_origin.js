module.exports = async ({ test, assert, affirm }) => [

    test("invalid test body type", () => {
        const missing_body = test("_")
        affirm(missing_body.trace, (trace) => trace.includes('error_origin.js'))
    })
    , test("interpreted error in test shows origin", () => {
        const undefined_dessert = test("_", () => { throw 1 })
        affirm(undefined_dessert.trace, (trace) => trace.includes('error_origin.js'))
    })
    , test("thrown error in test shows origin", () => {
        const thrown_error = test("_", () => assert(true, false))
        affirm(thrown_error.trace, (trace) => trace.includes('error_origin.js'))
    })
    , test("inner fail should still fail", async () => {
        const tr = await test("?>", async () => await assert(false, true))
        assert(true, !!tr.trace)
    })
    , await test("Find async error origin", async () => {
        const tr = await test("?>", async () => assert(false, true))
        affirm(tr.trace, (trace) => trace.includes('error_origin.js'))
    })
    , await test("async test without await gives await hint", async () => {
        const inner_awaited = await (async () => await test("async test without await", Promise.reject(null)))()
        const non_awaited = await (async () => test("async test without await", Promise.reject(null)))()

        const missing_async_msg = "Possible missing 'await' statement before an async test"

        affirm(inner_awaited.trace, t => !t.includes(missing_async_msg))
        affirm(inner_awaited.trace, t => t.includes('error_origin.js'))
        affirm(non_awaited.trace, t => t.includes(missing_async_msg))
        affirm(non_awaited.trace, t => !t.includes('error_origin.js'))
    })
]