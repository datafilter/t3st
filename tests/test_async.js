module.exports = async (framework) => {

    const { test, assert, affirm } = framework

    const async_tests = [
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
                assert(false, !!basic.error)
                affirm(() => basic.error === basic_async.error)
                affirm(() => basic_async.error === async_promise.error)
            }
        )
        , test("rejected promise returns error result",
            async () => {
                const assert_error = async (rejected_promise, error_message = '_some_error') => {
                    const async_error = await test("_", rejected_promise)
                    return assert(true, !!async_error.error)
                        && affirm(async_error.error, (err) => err.message.includes(error_message))
                }
                const e1 = await assert_error(Promise.reject(), 'Promise rejected >> unexpected error [undefined]')
                const e2 = await assert_error(Promise.reject(3), 'Promise rejected >> unexpected error [3]')
                const e3 = await assert_error(Promise.reject(new Error("oh my")), 'Promise rejected >> oh my')

                return e1 && e2 && e3
            }, (resolved) => {
                assert(true, resolved)
            }
        )
        , test("async test runs continuation", async () => {
            const confirm_continue = (compare) =>
                test("continuation",
                    async () => 'expected'
                    , (async_ran) => assert(compare, async_ran)
                )
            const continue_ok = await confirm_continue('expected')
            const continue_err = await confirm_continue('something else')
            assert('undefined', typeof continue_ok.error)
            affirm(continue_err.error, (err) =>
                err.includes('something else') && err.includes('expected'))
        })

    ]

    return async_tests
}
