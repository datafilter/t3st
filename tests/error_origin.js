module.exports = async ({ test, assert, affirm }) => [

    test("invalid test body type", () => {
        const missing_body = test("_")
        affirm(missing_body.trace, (trace) => trace.includes('error_origin.js'))
    })
    , test("error in test shows origin", () => {
        const undefined_dessert = test("_", () => dessert)
        affirm(undefined_dessert.trace, (trace) => trace.includes('error_origin.js'))
    })
    , await test("async promise rejected origin", async () => {
        const rejected_promise = await test("_", async () => assert(false, true))
        // console.log(rejected_promise.error.trace + ' [strace]')
        // console.log(rejected_promise.error.stack + ' [stack]')
        // affirm(rejected_promise.trace, (trace) => trace.includes('error_origin.js'))
    })

    // todo: also test non manual :O
    , test("manual test demo, remove comments to check", () => {
        // throw 'br'
        // not exist
        // assert(true, false)
    })

    // todo: also test non manual :O
    , await test("manual async test demo, remove comments to check", async () => {
        // throw 'br'
        // not exist
        // assert(true, false)
    })
]