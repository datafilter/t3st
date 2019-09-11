module.exports = async (framework) => {

    const { test, assert, affirm } = framework

    const async_tests = [
        await test("Promised task runs async",
            Promise.resolve()
        )
        , await test("await non-async function is ok", () => { })
        , await test("happy path - basic, awaited basic, and awaited async tests are equivalent after await",
            Promise.resolve((async () => {
                const basic = test("_", () => { })
                const basic_async = await test("_", () => { })
                const async_promise = await test("_", Promise.resolve())
                assert(basic.description, basic_async.description)
                assert(basic_async.description, async_promise.description)
                assert(false, !!basic.error)
                affirm(() => basic.error === basic_async.error)
                affirm(() => basic_async.error === async_promise.error)
            })())
        )
        , await test("rejected promise returns error result",
            Promise.resolve((async () => {
                const assert_error = async (rejected_promise, error_message = '?') => {
                    const async_error = await test("_", rejected_promise)
                    return assert(true, !!async_error.error)
                        && affirm(async_error.error, (err) => err.message.includes(error_message))
                }
                const e1 = await assert_error(Promise.reject(), 'Promise rejected >> unexpected error [undefined]')
                const e2 = await assert_error(Promise.reject(3), 'Promise rejected >> unexpected error [3]')
                const e3 = await assert_error(Promise.reject(new Error("oh my")), 'Promise rejected >> oh my')

                return e1 && e2 && e3
            })()), (resolved) => {
                assert(true, resolved)
            }
        )
        , await test("async test can run with async function", async () => {
            return 'proof'
        }, (async_ran) => {
            assert('proof', async_ran)
        })
    ]

    return async_tests
}
