module.exports = ({ test, equal, check }) => {
    return [
        test("empty returns error", () => {
            const nothing = test()
            equal("empty test", nothing.description)
            check(() => nothing.error.message.includes('invalid test'))
        })
        , test("any description test ok", () => {
            const any_value = [0, undefined, null, true, false, '', 't3st', f => g => x => g(f(x))]
            equal(true, any_value.every(name =>
                equal(false, !!test(name, () => true).trace)))
        })
        , test("without body returns error", () => {
            const detached_head = test("equal truthy")
            equal(true, !!detached_head.trace)
            check(() => detached_head.error.message.includes('invalid test'))
        })
        , test("ERROR body cannot be boolean", () => {
            const err_bool = test("_", true)
            check(err_bool.error.message, t => t.includes('invalid test !! expected test(string, {'))
        })
        , test("function body returns immediate result", () => {
            const test_complete = test("_", () => { })
            equal(test_complete.constructor.name, 'Object')
            equal(true, !!test_complete.description)
        })
        , test("async body returns promise result", () => {
            const test_promise = test("_", async () => { })
            equal(test_promise.constructor.name, 'Promise')
            equal(false, !!test_promise.description)
            equal(true, !!test_promise.then)
        })
        , test("unexpected body returns error result", () => {
            const unexpected_primitives = [null, 0, 1, 'oh, hi mark', Symbol()]
            const some_unexpected_objects = [Date.now(), { stack: 'trace' }, new Object(1), NaN, Infinity, new SyntaxError, Promise.resolve()]

            const unexpecteds = [...unexpected_primitives, ...some_unexpected_objects]

            unexpecteds.every(p => {
                const invalid_test = test("_", p)
                check(invalid_test.error, `unexpected body type in test(string, ${typeof p})`, (err, expected) =>
                    err.message.includes(expected))
            })
        })
    ]
}