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
        console.log("result: " + JSON.stringify({ description: tr.description, error: tr.error + '', trace: tr.trace }))
    })
    // best-attempt with async caught exceptions, not always possible to find source
    , await test("indeterminate async origin", async () => {
        const tr = await test("?>", async () => assert(false, true))
        // todo: NPX finds this file as source of the error -> 'npx t3st' (version 2020.1.8)
        //       But non-npx does not find the origin 't3st';'npm test';'node test.js'
        // NPX: at async /workspaces/node/npm-t3st/tests/error_origin.js:18:20
        // NPM: at processTicksAndRejections (internal/process/task_queues.js:97:5)
        // affirm(tr.trace, (trace) => !trace.includes('error_origin.js'))
        if (tr.trace.includes('error_origin.js')) {
            // NPX enters here, but node doesn't.
            // console.log(`origin found @ ${tr.trace}`)
        }
    })
    // for trace example, un-comment manual test to see line of code where error is:
    // , await test("demo manual async error", async () => err)
]