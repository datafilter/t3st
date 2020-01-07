module.exports = (framework) => {

    const { test, assert, affirm } = framework

    const test_results = [
        test("OK test returns it's own description, without error", () => {
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
            assert(true, err_result.error.startsWith('Evaluation [true] === [false]'))
        })
        , test("Stack is included in ERROR if available", () => {
            const err_result = test("_", () => { throw new Error('#20') })
            affirm(() => typeof err_result.error.stack !== undefined)
            affirm(err_result.error.stack + '', (stack) => stack.includes('test_results.js'))
        })
    ]

    return test_results
}
