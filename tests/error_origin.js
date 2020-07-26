module.exports = async ({ test, assert, affirm }) => [

    test("invalid test body type", () => {
        const missing_body = test("_")
        affirm(missing_body.trace, (trace) => trace.includes('error_origin.js'))
    })
    , test("interpreted error in test shows origin", () => {
        const undefined_dessert = test("_", () => dessert)
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
    // best-attempt with async caught exceptions
    , await test("Find async error origin", async () => {
        const tr = await test("?>", async () => assert(false, true))
        affirm(tr.trace, (trace) => trace.includes('error_origin.js'))
    })
    // // TODO for tests that cannot be validated within run.js scope:
    // // create [fail tests] folder with expected failurures & call them via shell
    // // Manual tests (uncomment to see errors):
    // , (async () => test("Sync test without await gives correct error", () => {
    //     throw 'err'
    // }))()
    // , (async () => test("Async test without await gives await hint on error", async () => {
    //     throw 'err'
    // }))()
]