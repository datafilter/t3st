module.exports = (framework) => {

    const { test, assert, affirm } = framework

    const test_results = [
        test("OK test passed with empty body", () => { })
        , test("OK test returns it's own description, without error", () => {
            const ok_result = test("my description", () => { })
            affirm(() => ok_result && !!ok_result.description)
            affirm(() => !ok_result.error)
            assert(ok_result.description, 'my description')
        })
        , test("ERROR test returns it's own description, and error", () => {
            const err_result = test("my description", () => assert(true, false))
            affirm(() => err_result && !!err_result.description)
            affirm(() => !!err_result.error)
            assert(err_result.description, 'my description')
            assert(err_result.error, 'Evaluation [true] === [false]')
        })
        , test("Error stack is included in error if available", () => {
            const err_result = test("", () => { throw new Error('#20?') })
            affirm(() => typeof err_result.error.stack !== undefined)
            affirm(err_result.error, () => err_result.error.stack.includes('test_results.js:21'))
        })
    ]

    return test_results
}
