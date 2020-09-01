module.exports = ({ test, equal, affirm }) => {
    return [
        test("OK test returns it's own description, without error", () => {
            const ok_result = test("my description", () => { })
            affirm(() => ok_result && !!ok_result.description)
            affirm(() => !ok_result.trace)
            equal(ok_result.description, 'my description')
        })
        , test("ERROR test returns it's own description, and error", () => {
            const err_result = test("my description", () => equal(true, false))
            affirm(() => err_result && !!err_result.description)
            affirm(() => !!err_result.trace)
            equal(err_result.description, 'my description')
            equal(true, err_result.error.message.startsWith('Evaluation [true] === [false]'))
        })
        , test("Stack is included in ERROR if available", () => {
            const err_result = test("_", () => { throw Error('#20') })
            affirm(() => typeof err_result.error.stack !== undefined)
            affirm(err_result.error.stack + '', (stack) => stack.includes('test_results.js'))
        })
    ]
}