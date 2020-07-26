module.exports = async ({ test, assert, affirm, alike }) => {
    return [
        await test("Promised task runs async",
            Promise.resolve()
        )
        , await test("await non-async function is ok", () => { })
        , await test("Promise.resolve constructor can be replaced with async keyword", async () => { })
        , test("not needed to await async test on creation", async () => { })
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
        , test("rejected promise returns error result",
            async () => {
                const assert_error = async (rejected_promise, error_message = '_some_error') => {
                    const async_error = await test(error_message, rejected_promise)
                    return assert(true, !!async_error.trace)
                        && affirm(async_error.error + '', error_message, (msg, expected) => msg.includes(expected))
                }
                await assert_error(Promise.reject(), 'Promise rejected: (undefined)')
                await assert_error(Promise.reject(3), 'Promise rejected: (3)')
                await assert_error(Promise.reject(Error("oh my")), 'Promise rejected: (Error: (oh my))')
            }
        )
        , test("thrown error has the same result as rejected promise",
            async () => {
                const failed_test = await test("_", async () => { throw 3 })
                const rejected_test = await test("_", Promise.reject(3))
                assert(true, !!failed_test.trace)
                alike(failed_test.error, rejected_test.error)
            })
        , test("async test runs continuation", async () => {
            const confirm_continue = (compare) =>
                test("continuation",
                    async () => 'expected'
                    , (async_ran) => assert(compare, async_ran)
                )

            const continue_ok = await confirm_continue('expected')
            assert.undefined(continue_ok.trace)

            const continue_err = await confirm_continue('something else')
            affirm(continue_err.error.message, (msg) =>
                msg.includes('something else') && msg.includes('expected'))
        })
        , test("expected failures are equivalent",
            async () => {
                const test_basic = test("_", () => { throw 'fail' })
                const test_async = await test("_", async () => { throw 'fail' })
                const test_promise = await test("_", Promise.reject('fail'))

                assert(test_basic.description, test_async.description)
                assert(test_async.description, test_promise.description)

                assert(true, !!test_basic.trace && !!test_async.trace && !!test_promise.trace)

                affirm(test_basic.error + '', test_async.error + '', (be, ae) => be !== ae)
                affirm(test_async.error + '', test_promise.error + '', (ae, pe) => ae === pe)
            }
        )

    ]
}