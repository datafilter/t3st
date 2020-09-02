module.exports = async ({ test, throws, equal, affirm }) => {

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
            affirm(result.error.message, (msg) => msg.includes('did not throw'))
        })
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
            affirm(halted.error, (he) => he !== 'invalid')
            affirm(halted.error.message, (msg) => msg.includes('did not throw'))
        })
    ]
}