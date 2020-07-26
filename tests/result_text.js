module.exports = ({ test, assert, affirm }) => {

    const { result_text } = require('../t3st-lib/text')

    const nop = () => { }

    const nonstring_names = [
        _x => _b => 5
        , function (some) {
            return some + 1
        }
        , 100
        , false
        , Symbol
    ]

    const result_tests = [
        test("error is included in error message", () => {
            const err_undefined = test("_", () => { not_defined })
            affirm(() => result_text(err_undefined).includes('ReferenceError: not_defined is not defined'))

            const err_string = test("_", () => { throw 'err-msg' })
            affirm(() => result_text(err_string).includes('err-msg'))

            const err_new_error = test("_", () => { throw Error('err--msg') })
            const rt = result_text(err_new_error)
            affirm(() => rt.includes('Error'))
            affirm(() => rt.includes('err--msg'))
            affirm(rt, s => s.includes('    at'))
            affirm(rt, () => rt.includes('result_text.js:'))
        })
        , test("OK test description is verbatim : *not* converted to string", () => {
            assert(true, nonstring_names.every(name => {
                const ok_test = test(name, nop)
                return assert(ok_test.description, name)
                    && assert(!!ok_test.trace, false)
                    && assert(result_text(ok_test), '[ok] ' + name)
            }))
        })
        , test("ERROR test description is verbatim : *not* converted to string", () => {
            assert(true, nonstring_names.every(name => {
                const err_test = test(name, () => assert(false, true))
                return assert(err_test.description, name)
                    && assert(!!err_test.trace, true)
                    && affirm(() => result_text(err_test).includes('[error] ' + name))
            }))
        })
        , test("description is open for re-use", () => {
            const person = 'brendan'
            const fun_test = test(name => `${name} has a plane.`, () => { })
            assert(fun_test.description(person), 'brendan has a plane.')
        })
        , test("error is open for re-use", () => {
            const err_test = test("_", () => { throw ((y) => y + 8) })
            assert(!!err_test.trace, true)
            assert(false, typeof err_test.error === 'string')
            assert('function', typeof err_test.error)
            assert(err_test.error(8), 16)
        })

    ]

    return result_tests
}
