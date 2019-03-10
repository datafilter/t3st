module.exports = (framework) => {

    const { test, assert, assert_fun } = framework

    const test_results = [
        test("OK test passed with empty body", () => { })
        , test("OK test returns it's own description, without error", () => {
            const ok_result = test("my description", () => { })
            assert_fun(() => ok_result && !!ok_result.description)
            assert_fun(() => !ok_result.error)
            assert(ok_result.description, 'my description')
        })
        , test("ERROR test returns it's own description, and error", () => {
            const err_result = test("my description", () => assert(true, false))
            assert_fun(() => err_result && !!err_result.description)
            assert_fun(() => !!err_result.error)
            assert(err_result.description, 'my description')
            assert(err_result.error, 'Evaluation [true] === [false]')
        })
        , test("Error stack is included in error if available", () => {
            const err_result = test("", () => { throw new Error('#20?') })
            assert_fun(() => typeof err_result.error.stack !== undefined)
            assert_fun(err_result.error, () => err_result.error.stack.includes('test_results.js:21'))
        })
    ]

    return test_results
}
