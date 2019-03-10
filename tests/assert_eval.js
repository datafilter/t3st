module.exports = (framework) => {

    const { test, assert, assert_fun, assert_eval } = framework

    const assert_eval_chain_tests = [
        test("true assert returns true",
            () => assert(true, assert_eval('1 === 1')))
        , test("chained assert stops at first error", () => {
            const err_third = test("_",
                () => assert_eval('1 === 1') && assert_eval('2 === 2') && assert_eval('1 === 5') && assert_eval('6 === 7'))
            assert('Evaluation [1 === 5] !! (false)', err_third.error)
        })
    ]

    const assert_eval_tests = [
        test("True eval is ok", () => assert_eval('true') && assert_eval('1 == 1') && assert_eval(true))
        , test("expects a boolean result", () => {
            const non_boolean = test("_", () => assert_eval(`'truthy'`))
            assert(true, !!non_boolean.error)
            assert_fun(non_boolean.error, () =>
                non_boolean.error.includes('expected assert_eval(expression => boolean)'))

            assert(false, non_boolean.error.includes("failed *before* assertion"))
        })
        , test("ok assert truthy with !!", () => assert_eval(`!!'truthy'`) && assert_eval(!!'truthy'))
        , test("False eval is error", () => {
            const err_false_eval = test("_", () => assert_eval('1 > 2'))
            assert('Evaluation [1 > 2] !! (false)', err_false_eval.error)
        })
        , test("error in assertion is included in error", () => {
            const err_invalid_eval = test("_", () => assert_eval('missing_reference'))
            assert_fun(() => err_invalid_eval.error.includes('ReferenceError: missing_reference is not defined'))
        })
        , test("Fails with no arguments or undefined", () => {
            const eval_empty = test("", () => assert_eval())
            const eval_undefined = test("", () => assert_eval(undefined))

            assert(true, !!eval_empty.error)
            assert(true, !!eval_undefined.error)

            assert(eval_empty.error, eval_undefined.error)

            assert_fun(eval_empty.error, () => eval_empty.error.includes('missing or undefined expression'))
            assert_fun(eval_empty.error, () => eval_empty.error.includes('use !! to evaluate truthy values'))
        })
        , test("Non boolean evals are type errors", () => {
            const non_booleans = [null, NaN, 0, '', 5, `'truthy'`, {}, () => 4]
            non_booleans.forEach(v => {
                const falsy_eval = test("", () => assert_eval(v))
                assert(true, !(typeof v === 'boolean'))
                assert(true, !!falsy_eval.error)
                assert(true, falsy_eval.error.includes('expected assert_eval(expression => boolean)'))
            })
        })

    ]

    return [assert_eval_chain_tests, assert_eval_tests]
}
