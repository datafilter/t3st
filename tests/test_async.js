module.exports = async (framework) => {

    const { test, assert, affirm, result_text } = framework

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
                // todo test async_async
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
                    assert(true, !!async_error.error)
                    const err_result = result_text(async_error)
                    affirm(err_result, () => err_result.includes(error_message))
                }
                await assert_error(Promise.reject(), 'Promise rejected >> unexpected error [undefined]')
                await assert_error(Promise.reject(3), 'Promise rejected >> unexpected error [3]')
                await assert_error(Promise.reject(new Error("oh my")), 'Promise rejected >> oh my')
            })())
        )
        , await test("async test can run with async function", async () => {
            // todo proof.
        })
    ]

    return async_tests
}
