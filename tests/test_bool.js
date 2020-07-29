module.exports = ({ test, assert }) => {
    return [
        test("OK boolean body returns true result", 500 !== 43 && '5' == 5)
        , test("ERROR boolean body returns result", () => {
            const err_bool = test("_", '5' === 5)
            assert(true, !!err_bool.trace)
            assert(err_bool.error.message, 'Evaluation [true] === [false]')
        })
        , test("ERROR boolean body stops immediately", () => {
            const stopped_test = test("_", false, () => { throw '~err~' })
            assert(true, !!stopped_test.trace)
            assert(stopped_test.error.message, 'Evaluation [true] === [false]')
        })
    ]
}