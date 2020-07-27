module.exports = ({ test, assert }) => {
    return [
        test("OK boolean body returns true result", 500 !== 43 && '5' == 5)
        , test("ERROR boolean body returns result", () => {
            const err_bool = test("_", NaN === NaN)
            assert(true, !!err_bool.trace)
            assert(err_bool.error, 'Evaluation [true] === [false]')
        })
        , test("OK boolean body runs continuation", () => {
            const resumed_test = test("_", true, () => { throw '~err~' })
            assert(true, !!resumed_test.trace)
            assert('~err~', resumed_test.error)
        })
        , test("ERROR boolean body stops immediately", () => {
            const stopped_test = test("_", false, () => { throw '~err~' })
            assert(true, !!stopped_test.trace)
            assert(stopped_test.error, 'Evaluation [true] === [false]')
        })
    ]
}