module.exports = (framework) => {

    const { test, assert, affirm, result_text } = framework

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
            assert(true, nonstring_names.every(name => {
                const ok_test = test(name, nop)
                return assert(ok_test.description, name)
                    && assert(!!ok_test.error, false)
                    && assert(result_text(ok_test), '[ok] ' + name)
            }))
        })
        , test("ERROR test description is converted to string", () => {
            assert(true, nonstring_names.every(name => {
                const err_test = test(name, () => assert(false, true))
                return assert(err_test.description, name)
                    && assert(!!err_test.error, true)
                    && affirm(() => result_text(err_test).includes('[error] ' + name))
            }))
        })
        , test("error is included in error message", () => {
            const err_undefined = test("_", () => { not_defined })
            affirm(() => result_text(err_undefined).includes('ReferenceError: not_defined is not defined'))

            const err_string = test("_", () => { throw 'err-msg' })
            affirm(() => result_text(err_string).includes('err-msg'))

            const err_new_error = test("_", () => { throw new Error('err--msg') })
            const rt = result_text(err_new_error)
            affirm(() => rt.includes('Error'))
            affirm(() => rt.includes('err--msg'))
            affirm(() => rt.includes('stack'))
            affirm(() => rt.includes('result_text.js:41'))
        })

    ]

    return result_tests
}
