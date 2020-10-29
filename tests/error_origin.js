module.exports = async ({ test, equal, check }) => [

    test("invalid test body type", () => {
        const missing_body = test("_")
        check(missing_body.trace, (trace) => trace.includes('error_origin.js'))
    })
    , test("interpreted error in test shows origin", () => {
        const undefined_dessert = test("_", () => { throw 1 })
        check(undefined_dessert.trace, (trace) => trace.includes('error_origin.js'))
    })
    , test("thrown error in test shows origin", () => {
        const thrown_error = test("_", () => equal(true, false))
        check(thrown_error.trace, (trace) => trace.includes('error_origin.js'))
    })
    , test("inner fail should still fail", async () => {
        const tr = await test("?>", async () => await equal(false, true))
        equal(true, !!tr.trace)
    })
    , await test("Find async error origin", async () => {
        const tr = await test("?>", async () => equal(false, true))
        check(tr.trace, (trace) => trace.includes('error_origin.js'))
    })
    , await test("async test without await also finds error origin", async () => {

        const inner_awaited = await (async () => await test("async test with await", async () => {
            throw 'known?'
        }))()
        const non_awaited = await (async () => test("async test without await", async () => {
            throw 'unknown?'
        }))()

        const missing_async_msg = "Possible missing 'await' statement before an async test"

        // maybe fails on ubuntu 18.04.4 node 12.18.3? // TODO remove comment if fixed.

        check(inner_awaited.trace, t1 => !t1.includes(missing_async_msg))
        check(inner_awaited.trace, t2 => t2.includes('error_origin.js'))
        // console.log(`inner_awaited: ${JSON.stringify(inner_awaited,null,2)}\nia-trace: ${inner_awaited.trace}`)

        check(non_awaited.trace, t3 => !t3.includes(missing_async_msg))
        check(non_awaited.trace, t4 => t4.includes('error_origin.js'))
    })
]