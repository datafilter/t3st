module.exports = (framework) => {

    const { test, assert, assert_fun } = framework

    const test_tests = [
        test("nothing returns error", () => {
            const nothing = test()
            assert("empty test", nothing.description)
            assert_fun(() => nothing.error.includes('invalid test'))
        })
        , test("without body returns error", () => {
            const detached_head = test("assert truthy")
            assert(true, !!detached_head.error)
            assert_fun(() => detached_head.error.includes('invalid test'))
        })
        , test("description is open for re-use", () => {
            const person = 'brendan'
            const fun_test = test(name => `${name} has a plane.`, () => { })
            assert(fun_test.description(person), 'brendan has a plane.')
        })
        , test("error is open for re-use", () => {
            const err_test = test("_", () => { throw ((y) => y + 8) })
            assert(!!err_test.error, true)
            assert(false, typeof err_test.error === 'string')
            assert(err_test.error(8), 16)
        })
        , test("OK boolean body returns true result", 500 !== 43 && '5' == 5)
        , test("ERROR boolean body returns result", () => {
            const err_bool = test("_", NaN === NaN)
            assert(true, !!err_bool.error)
            assert(err_bool.error, '(false)')
        })
    ]

    return test_tests
}
