module.exports = (framework) => {

    const { test, assert, assert_fun, result_text } = framework

    const nop = () => { }

    const nonstring_names = [
        x => b => 5
        , function (some) {
            return some + 1
        }
        , 100
        , false
        , Symbol
    ]

    const result_tests = [
        test("OK test description is converted to string", () => {
            nonstring_names.forEach(name => {
                const ok_test = test(name, nop)
                assert(ok_test.description, name)
                assert(!!ok_test.error, false)
                assert(result_text(ok_test), '[ok] ' + name)
            })
        })
        , test("ERROR test description is converted to string", () => {
            nonstring_names.forEach(name => {
                const err_test = test(name, () => assert(false, true))
                assert(err_test.description, name)
                assert(!!err_test.error, true)
                assert_fun(() => result_text(err_test).includes('[error] ' + name))
            })
        }), test("error is included in error message", () => {
            const err_undefined = test("_", () => { throw 'err-msg' })
            assert_fun(() => result_text(err_undefined).includes('err-msg'))

            const err_undefined_new = test("_", () => { throw new Error('err--msg') })
            assert_fun(() => result_text(err_undefined_new).includes('Error'))
            assert_fun(() => result_text(err_undefined_new).includes('err--msg'))
        })

    ]

    // todo [ separation of concerns ] ?
    // error shouldn't be cast (see test.js)

    return result_tests
}
