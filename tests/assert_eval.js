module.exports = (framework) => {

    const { test, assert, assert_fun, assert_eval } = framework

    const assert_eval_chain_tests = [
        test("true assert returns true",
            () => assert(true, assert_eval(true)))
        , test("chained assert stops at first error", () => {
            const err_third = test("_",
                () => assert_eval(true) && assert_eval('1 === 1') && assert_eval('1 === 5') && assert_eval('6 === 7'))
            assert('Evaluation [1 === 5] !! (falsy eval)', err_third.error)
        })
    ]

    const assert_eval_tests = [
        test("True eval is ok", () => assert_eval('true') && assert_eval('1 == 1'))
        , test("Truthy eval is ok", () => assert_eval('5') && assert_eval(`'truthy'`))
        , test("False eval is error", () => {
            const err_false_eval = test("_", () => assert_eval('1 > 2'))
            assert('Evaluation [1 > 2] !! (falsy eval)', err_false_eval.error)
        })
        , test("Falsey evals are errors", () => {
            const falsy_values = [false, undefined, null, NaN, 0, '']
            falsy_values.forEach(v => {
                assert(false, !!v)
                assert(true, !!test("", () => assert_eval(v)).error)
            })
        })
        , test("error in assertion is included in error", () => {
            const err_invalid_eval = test("_", () => assert_eval('missing_reference'))
            assert_fun(() => err_invalid_eval.error.includes('ReferenceError: missing_reference is not defined'))
        })
        , test("Fails with no arguments ", () => assert(true, !!test("", () => assert_eval()).error))
    ]

    return [assert_eval_chain_tests, assert_eval_tests]
}
