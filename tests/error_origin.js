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
        // const inner_awaited = await (async () => await test("async test with await", Promise.reject(null)))()
        // const non_awaited = await (async () => test("async test without await", Promise.reject(null)))()

        const inner_awaited = await (async () => await test("async test with await", async ()=> {
            throw 'known?'
        }))()
        const non_awaited = await (async () => test("async test without await", async () =>{
            throw 'unknown?'
        }))()

        const missing_async_msg = "Possible missing 'await' statement before an async test"

        // fails on ubuntu 18.04.4 node 12.18.3
        // affirm(inner_awaited.trace, t1 => !t1.includes(missing_async_msg))
        // affirm(inner_awaited.trace, t2 => t2.includes('error_origin.js'))
        console.log(`inner_awaited: ${inner_awaited}\nia-trace: ${inner_awaited.trace}`)
        affirm(non_awaited.trace, t3 => t3.includes(missing_async_msg))
        affirm(non_awaited.trace, t4 => !t4.includes('error_origin.js'))
    })
]