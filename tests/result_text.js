module.exports = ({ test, equal, check }) => {

    const { result_text } = require('../lib/report')

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
            check(() => result_text(err_undefined).message.includes('ReferenceError: _undefined is not defined'))

            const err_string = test("_", () => { throw 'err-msg' })
            check(() => result_text(err_string).message.includes('err-msg'))

            const err_new_error = test("_", () => { throw Error('err--msg') })
            const rt = result_text(err_new_error).message
            check(() => rt.includes('Error'))
            check(() => rt.includes('err--msg'))
            check(rt, s => s.includes('    at'))
            check(rt, () => rt.includes('result_text.js:'))
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
                    && check(() => result_text(err_test).message.includes('[error] ' + name))
            }))
        })
        , test("source is not derived from thrown error stacktrace", () => {
            const err_test = test('description', () => equal('at some/code.js', '\nat other/file.mjs'))
            const [description, source, ...detail] = result_text(err_test).message.split('\n')
            equal(description, '[error] description')
            check(source, (s) => s.includes('result_text.js'))
            check(detail.join('\n'), (d) => d.includes('at some/code.js') && d.includes('at other/file.mjs'))
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
