module.exports = ({ test, equal, affirm }) => {

    const { result_text } = require('../lib/text')

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
            /* eslint-disable no-undef */
            const err_undefined = test("_", () => { _undefined })
            /* eslint-disable no-undef */
            affirm(() => result_text(err_undefined).message.includes('ReferenceError: _undefined is not defined'))

            const err_string = test("_", () => { throw 'err-msg' })
            affirm(() => result_text(err_string).message.includes('err-msg'))

            const err_new_error = test("_", () => { throw Error('err--msg') })
            const rt = result_text(err_new_error).message
            affirm(() => rt.includes('Error'))
            affirm(() => rt.includes('err--msg'))
            affirm(rt, s => s.includes('    at'))
            affirm(rt, () => rt.includes('result_text.js:'))
        })
        , test("OK test description is verbatim : *not* converted to string", () => {
            equal(true, nonstring_names.every(name => {
                const ok_test = test(name, nop)
                return equal(ok_test.description, name)
                    && equal(!!ok_test.trace, false)
                    && equal(result_text(ok_test).message, '[ok] ' + name)
            }))
        })
        , test("ERROR test description is verbatim : *not* converted to string", () => {
            equal(true, nonstring_names.every(name => {
                const err_test = test(name, () => equal(false, true))
                return equal(err_test.description, name)
                    && equal(!!err_test.trace, true)
                    && affirm(() => result_text(err_test).message.includes('[error] ' + name))
            }))
        })
        , test("description is open for re-use", () => {
            const person = 'brendan'
            const fun_test = test(name => `${name} has a plane.`, () => { })
            equal(fun_test.description(person), 'brendan has a plane.')
        })
        , test("error is open for re-use", () => {
            const err_test = test("_", () => { throw ((y) => y + 8) })
            equal(!!err_test.trace, true)
            equal(false, typeof err_test.error === 'string')
            equal('function', typeof err_test.error)
            equal(err_test.error(8), 16)
        })

    ]

    return result_tests
}
