module.exports = (framework) => {

    const { test, assert, affirm } = framework

    const now_tests = [
        test("OK test passed with empty body", () => { })
        , test("OK runs continuation", () => 'five', (f) => assert('five', f))
        , test("ERROR stops continuation", () => {
            const non_continue = test("_", () => errr, (_na) => true)
            affirm(non_continue.error + '', (err) => err.includes('errr is not defined'))
        })
    ]

    return now_tests
}
