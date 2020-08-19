module.exports = async ({ test, assert, affirm }) => {
    return [
        await test("Promise is invalid body", () => {
            const invalid = test("invalid", Promise.resolve())
            assert(true, !!invalid.trace)
        })
        , await test("await non-async function is ok", () => { })
        , await test("await async function is ok", async () => { })
        , await test("an async test is a promise", () => {
            const test_async = test("async", async () => { })
            affirm(test_async.constructor.name, (name) => name === 'Promise')
        })
        , test("not needed to await async test on creation for passing tests", async () => { })
        , test("happy path - basic, awaited basic, and awaited async tests are equivalent after await",
            async () => {
                const basic = test("_", () => { })
                const basic_async = await test("_", async () => { })
                assert(basic.description, basic_async.description)
                assert(false, !!basic.trace)
                affirm(() => basic.error === basic_async.error)
            }
        )
        , test("thrown error returns error result verbatim",
            async () => {
                const assert_error = async (rejected_promise, error_message) => {
                    const async_error = await test(error_message, rejected_promise)
                    return assert(true, !!async_error.trace)
                        && affirm(async_error.error + '', error_message + '', (msg, expected) => msg.includes(expected))
                }
                await assert_error(async () => { throw undefined }, undefined)
                await assert_error(async () => { throw 3 }, 3)
                await assert_error(async () => { throw Error("oh my") }, 'oh my')
            }
        )
        // TODO Test and/or change/document : Anything thrown async converts to error
        // therefore (currently/correctly?) *not* open for re-use like sync result errors.
        , await test("expected failures are equivalent",
            async () => {
                const test_basic = test("_", () => { throw 'fail' })
                const test_async = await test("_", async () => { throw 'fail' })

                assert(test_basic.description, test_async.description)

                assert(true, !!test_basic.trace && !!test_async.trace)

                affirm(test_basic.error + '', test_async.error + '', (be, ae) => be === ae)
            }
        )
        , await test("async test gives expected error on null body", async () => {
            const result = await test("_", async () => { throw null })
            assert(null, result.error)
        })
    ]
}