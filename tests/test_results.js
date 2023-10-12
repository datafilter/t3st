module.exports = ({ test, equal, check }) => {
    return [
        test("OK test returns it's own description, without error", () => {
            const ok_result = test("my description", () => { })
            check(() => ok_result && !!ok_result.description)
            check(() => !ok_result.trace)
            equal(ok_result.description, 'my description')
        })
        , test("ERROR test returns it's own description, and error", () => {
            const err_result = test("my description", () => equal(true, false))
            check(() => err_result && !!err_result.description)
            check(() => !!err_result.trace)
            equal(err_result.description, 'my description')
            equal(true, err_result.error.message.startsWith('Evaluation [true] === [false]'))
        })
        , test("Stack is included in ERROR if available", () => {
            const err_result = test("_", () => { throw Error('#20') })
            equal(typeof err_result.error.stack, 'string')
            check(err_result.error.stack + '', (stack) => stack.includes('test_results.js'))
        })
    ]
}