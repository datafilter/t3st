const { assert, test, display_message } = require('./index')

const ok_test = test(`show [ok] on ok`, () => {
    const two = 2
    assert(`${two} == 2`)
})

const err_eval = test(`show evaluation on error`, () => {
    assert(`1 > 2`)
})

const err_eval_err = test(`show evaluation exception`, () => {
    assert(undefined_variable)
})

const err_throw = test(`show thrown error`, () => {
    throw 'ThrownError'
})

const ok_test_tests = test(`test functions yield expected results with correct messages`, () => {
    const test_test = (result, expected_assert, expected_message) => {
        const passed = !result.error
        const message = display_message(result)
        assert(`${passed === expected_assert} && '${result.description}'`)
        assert(`'${message}' === '${expected_message}'`)
    }
    test_test(ok_test, true, '[ok] show [ok] on ok')
    test_test(err_eval, false, '[error] show evaluation on error --> Evaluation [1 > 2]')
    test_test(err_eval_err, false, '[error] show evaluation exception --> ReferenceError: undefined_variable is not defined')
    test_test(err_throw, false, '[error] show thrown error --> ThrownError')
})

const display = (test) => console.log(display_message(test))

console.log('Expected failing tests:\n')
display(err_eval)
display(err_eval_err)
display(err_throw)
console.log('\nExpected passing tests:\n')
display(ok_test)
display(ok_test_tests)
