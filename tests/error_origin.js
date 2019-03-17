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

    // best-attempt with async caught exceptions, not always possible to find source
    , await test("indeterminate async origin", async () => {
        const rejected_promise = await test("_", async () => assert(false, true))
        affirm(rejected_promise.trace, (trace) => !trace.includes('error_origin.js'))
    })
    // for example, un-comment manual test:
    // , await test("demo manual async error", async () => err)
]