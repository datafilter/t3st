const {assert, test, display_message } = require('./index')

let ok_test = test(`show [ok] on ok`, () => {
    let two = 2
    assert(`${two} == 2`)
})
let err_eval = test(`show evaluation on error`, () => {
    assert(`1 > 2`)
})
let err_eval_err = test(`show evaluation exception`, () => {
    assert(undefined_variable)
})
let err_throw = test(`show thrown error`, () => {
    throw 'ThrownError'
})
let ok_test_tests = test(`test functions yield expected results with correct messages`, () => {
    let test_test = (result, expected_assert, expected_message) => {
        let passed = !result.error
        let message = display_message(result)
        assert(`${passed === expected_assert} && '${result.description}'`)
        assert(`'${message}' === '${expected_message}'`)
    }
    test_test(ok_test, true, '[ok] show [ok] on ok')
    test_test( err_eval, false, '[error] show evaluation on error --> Evaluation [1 > 2]')
    test_test(err_eval_err, false, '[error] show evaluation exception --> ReferenceError: undefined_variable is not defined')
    test_test(err_throw, false, '[error] show thrown error --> ThrownError')
})

const print = console.log
let display = (test) => print(display_message(test))
display(ok_test_tests)
print('-'.repeat(99))
