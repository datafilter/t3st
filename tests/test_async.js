module.exports = async ({ test, assert, affirm, alike }) => {
    return [
        await test("Promised task runs async",
            Promise.resolve()
        )
        , await test("await non-async function is ok", () => { })
        , await test("Promise.resolve constructor can be replaced with async keyword", async () => { })
        , await test("an async test is a promise", () => {
            const test_async = test("async", async () => { })
            affirm(test_async.constructor.name, (name) => name === 'Promise')
        })
        , test("not needed to await async test on creation for passing tests", async () => { })
        , test("happy path - basic, awaited basic, and awaited async tests are equivalent after await",
            async () => {
                const basic = test("_", () => { })
                const basic_async = await test("_", async () => { })
                const async_promise = await test("_", Promise.resolve())
                assert(basic.description, basic_async.description)
                assert(basic_async.description, async_promise.description)
                assert(false, !!basic.trace)
                affirm(() => basic.error === basic_async.error)
                affirm(() => basic_async.error === async_promise.error)
            }
        )
        , test("rejected promise returns error result verbatim",
            async () => {
                const assert_error = async (rejected_promise, error_message) => {
                    const async_error = await test(error_message, rejected_promise)
                    return assert(true, !!async_error.trace)
                        && affirm(async_error.error + '', error_message + '', (msg, expected) => msg.includes(expected))
                }
                await assert_error(Promise.reject(), undefined)
                await assert_error(Promise.reject(3), 3)
                await assert_error(Promise.reject(Error("oh my")), 'oh my')
            }
        )
        , test("thrown error has the same result as rejected promise",
            async () => {
                const failed_test = await test("_", async () => { throw 3 })
                const rejected_test = await test("_", Promise.reject(3))
                assert(true, !!failed_test.trace)
                alike(failed_test.error, rejected_test.error)
            })
        // TODO Test and/or change/document : Anything thrown async converts to error
        // therefore (currently/correctly?) *not* open for re-use like sync result errors.
        , await test("expected failures are equivalent",
            async () => {
                const test_basic = test("_", () => { throw 'fail' })
                const test_async = await test("_", async () => { throw 'fail' })
                const test_promise = await test("_", Promise.reject('fail'))

                assert(test_basic.description, test_async.description)
                assert(test_async.description, test_promise.description)

                assert(true, !!test_basic.trace && !!test_async.trace && !!test_promise.trace)

                affirm(test_basic.error + '', test_async.error + '', (be, ae) => be === ae)
                affirm(test_async.error + '', test_promise.error + '', (ae, pe) => ae === pe)
            }
        )
        , await test("async test gives expected error on null body", async () => {
            const result = await test("_", Promise.reject(null))
            assert(null, result.error)
        })
    ]
}