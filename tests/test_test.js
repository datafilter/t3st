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
        , test("OK boolean body returns true result", 500 !== 43 && '5' == 5)
        , test("ERROR boolean body returns result", () => {
            const err_bool = test("_", NaN === NaN)
            assert(true, !!err_bool.error)
            assert(err_bool.error, '(false)')
        })
        , test("function body returns immediate result", () => {
            const test_complete = test("_", () => { })
            assert(test_complete.constructor.name, 'Object')
            assert(true, !!test_complete.description)
        })
        , test("promise body returns promise result", () => {
            const test_promise = test("_", Promise.resolve())
            assert(test_promise.constructor.name, 'Promise')
            assert(false, !!test_promise.description)
            assert(true, !!test_promise.then)
        })
        , test("IIFE async body returns promise result", () => {
            const test_promise = test("_", (async () => { })())
            assert(test_promise.constructor.name, 'Promise')
            assert(false, !!test_promise.description)
            assert(true, !!test_promise.then)
        })
        , test("async body returns promise result", () => {
            const test_promise = test("_", async () => { })
            assert(test_promise.constructor.name, 'Promise')
            assert(false, !!test_promise.description)
            assert(true, !!test_promise.then)
        })
        , test("unexpected body returns error result", () => {
            const unexpected_primitives = [null, 0, 1, 'oh, hi mark', Symbol()]
            // todo shouldn't be:  undefined //different result, see test "without body returns error"
            const some_unexpected_objects = [Date.now(), { stack: 'trace' }, new Object(1), NaN, Infinity, new SyntaxError]

            assert(true, [...unexpected_primitives, ...some_unexpected_objects].every(p => {
                const invalid_test = test("_", p)
                return invalid_test.error.includes(`invalid test body type in test(string, ${typeof p})`)
            }))
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
    ]

    return test_tests
}
