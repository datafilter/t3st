module.exports = (framework) => {

    const { test, assert, affirm } = framework

    const now_tests = [
        test("OK test passed with empty body", () => { })
    ]

    return now_tests
}
