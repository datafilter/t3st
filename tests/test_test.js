module.exports = ({ test, assert, affirm }) => {
    return [
        test("empty returns error", () => {
            const nothing = test()
            assert("empty test", nothing.description)
            affirm(() => nothing.error.message.includes('invalid test'))
        })
        , test("any description test ok", () => {
            const any_value = [0, undefined, null, true, false, '', 't3st', f => g => x => g(f(x))]
            assert(true, any_value.every(name =>
                assert(false, !!test(name, () => true).trace)))
        })
        , test("without body returns error", () => {
            const detached_head = test("assert truthy")
            assert(true, !!detached_head.trace)
            affirm(() => detached_head.error.message.includes('invalid test'))
        })
        , test("ERROR body cannot be boolean", () => {
            const err_bool = test("_", true)
            affirm(err_bool.trace, t => t.includes('invalid test !! expected test(string, {'))
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
            const some_unexpected_objects = [Date.now(), { stack: 'trace' }, new Object(1), NaN, Infinity, new SyntaxError]

            const unexpecteds = [...unexpected_primitives, ...some_unexpected_objects]

            unexpecteds.every(p => {
                const invalid_test = test("_", p)
                affirm(invalid_test.error, `unexpected body type in test(string, ${typeof p})`, (err, expected) =>
                    err.message.includes(expected))
            })
        })
    ]
}