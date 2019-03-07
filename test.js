const { assert, assert_fun, test, result_text, tally_results } = require('./index')

const ok_test = test(`show [ok] on ok`, () => {
    const one = 1
    assert(`${one} == 1`)
})

const ok_assert_two_arguments = test(`assert with 2 arguments compares with (x) === (y)`, () => {
    const two = 2
    assert(two, 2)
})

const ok_second_argument_false = test('both assert arguments can be false', () => {
    assert(!!undefined, false)
})

const err_code = test(`show evaluation exception`, () => {
    undefined_reference
})

const err_eval = test(`show evaluation on error`, () => {
    assert(`1 > 2`)
})

const err_eval_non_string = test(`show single truthy assert error`, () => {
    assert(!!'test')
})

const err_throw = test(`show thrown error`, () => {
    throw 'ThrownError'
})

const err_assert_two_arguments_equals = test(`assert with 2 arguments compares with equals`, () => {
    const two = 2
    assert(two, 123)
})

const err_assert_two_arguments_types = test(`assert with 2 arguments preserves types`, () => {
    const two = "123"
    assert(two, 123)
})

const ok_test_tests = test(`test functions yield expected results with correct messages`, () => {
    const test_test = (result, expected_assert, expected_message) => {
        const passed = !result.error
        const message = result_text(result)
        assert(`${passed === expected_assert} && '${result.description}'`)
        assert_fun(() => expected_message.startsWith(message))
    }
    test_test(ok_test, true, '[ok] show [ok] on ok')
    test_test(ok_assert_two_arguments, true, '[ok] assert with 2 arguments compares with (x) === (y)')
    test_test(ok_second_argument_false, true, '[ok] both assert arguments can be false')
    test_test(err_eval, false, '[error] show evaluation on error --> Evaluation [1 > 2]')
    test_test(err_code, false, '[error] show evaluation exception --> ReferenceError: undefined_reference is not defined')
    test_test(err_eval_non_string, false, `[error] show single truthy assert error --> Use assert(boolean, !!something) to assert truthy values. (PEP 20 ~ explicit is better than implicit)`)
    test_test(err_throw, false, '[error] show thrown error --> ThrownError')
    test_test(err_assert_two_arguments_equals, false, '[error] assert with 2 arguments compares with equals --> Evaluation [2] === [123]')
    test_test(err_assert_two_arguments_types, false, `[error] assert with 2 arguments preserves types --> Evaluation ['123'] === [123]`)
})

let ok_tests = [ok_test
    , ok_assert_two_arguments
    , ok_second_argument_false
    , ok_test_tests
]

let error_tests = [err_eval
    , err_code
    , err_eval_non_string
    , err_throw
    , err_assert_two_arguments_equals
    , err_assert_two_arguments_types
]

let show = console.log

show(tally_results(`${ok_tests.length} Expected passing tests:\n`, ...ok_tests))

show(tally_results(`${error_tests.length} Expected failing tests:\n`, ...error_tests))

