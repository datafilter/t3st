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
        // ,test("error is open for re-use", () => {

        // })

    ]

    return test_tests
}