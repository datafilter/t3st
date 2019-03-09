module.exports = (framework) => {

    const { test, assert, assert_fun } = framework

    const test_tests = [
        test("empty test description throws error", () => {
            const err_invalid_name_value = test("na", () => test('', () => {}))
            // const err_missing_name = test("na", () => test(() => {}))
            // const err_invalid_name_type = test("na", () => test(() => {}))
            console.log('ia:' + err_invalid_name_value)
            console.log('ia:' + err_invalid_name_value.error)
            // assert('wtk', err_invalid_name_value.error)
        })

    ]

    return test_tests
}
