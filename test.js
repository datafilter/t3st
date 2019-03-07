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

const err_assert_fun_throws = test("assert_fun throws error on false evaluation", () => {
    assert_fun(() => false)
})

const err_assert_fun_invalid_code = test("assert_fun fails when function code is invalid", () => {
    assert_fun(() => nondefined)
})

let ok_tests = [ok_test
    , ok_assert_two_arguments
    , ok_second_argument_false
]

let error_tests = [err_eval
    , err_code
    , err_eval_non_string
    , err_throw
    , err_assert_two_arguments_equals
    , err_assert_two_arguments_types
    , err_assert_fun_throws
    , err_assert_fun_invalid_code
]

let show = console.log

show(tally_results(`${ok_tests.length} Expected passing tests:\n`, ...ok_tests))

show(tally_results(`${error_tests.length} Expected failing tests:\n`, ...error_tests))

