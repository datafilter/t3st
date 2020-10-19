const { test, throws, equal, check } = require('../lib/validation')

module.exports = async () => {

    return [
        test("throws catches error and returns test result", () => {
            const result = throws('<test description>', () => {
                throw 1
            })
            equal({ description: '<test description>' }, result)
        })
        , test("non-thrown is error result", () => {
            const result = throws('', () => 0)
            equal(true, !!result.trace)
            check(result.error.message, (msg) => msg.includes('did not throw'))
        })
        , test("throws can be used inline when first argument is function", () => {
            const data = Symbol()
            const err = throws(() => { throw data })
            equal(err, data)
        })
        , throws("inline throws throws when error is not thrown",
            () => throws(() => 0)
            , (err) => check(err.message, (m) => m.includes('did not throw'))
        )
        , test("throws has continuation when expected is thrown", () => {
            const conintued = throws('<test>', () => {
                throw 123
            }, (err) => {
                if (err === 123)
                    throw '<continue>'
            })
            equal('<continue>', conintued.error)
        })
        , test("continuation not called when expected is not thrown", () => {
            const halted = throws('<test>', () => 0,
                (_err) => {
                    throw 'invalid'
                })
            check(halted.error, (he) => he !== 'invalid')
            check(halted.error.message, (msg) => msg.includes('did not throw'))
        })
        , test('without any arguments give usage hint', () => {
            const result = throws()
            equal(true, result.is_error)
            check(result.description, d => d.includes('throws() is empty'))
            check(result.error.message, (m) => m.includes('expected') && m.includes('..code'))
        })
        , test('test description matches throws description', () => {
            const ok = throws('match', () => { throw 1 })
            const result = throws('match')
            equal(true, result.is_error)
            equal.undefined(ok.is_error)
            equal(ok.description, result.description)
            check(result.description, d => d.includes('match'))
            check(result.error.message, (m) => m.includes('expected throws(`match`'))
        })
    ]
}