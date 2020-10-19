module.exports = ({ throws, equal, check }) => [

    // todo move all non-(test, throws, equal ,check) error message tests here.
    // move all (test, throws, equal, check) messages to those files.
    // rename this to ?test_runner?_error_messages

    throws("Equal quotes string in error vs boolean", () =>
        equal(true, 'true'), (error) =>
        check(error.message,
            (m) => m.includes(`[true] === ['true']`)))
    , throws("Equal quotes string in error vs number", () =>
        equal(0, '0'), (error) =>
        check(error.message, (m) => m.includes(`[0] === ['0']`)))
    , throws("check function invalid output", () => {
        check('a', 2, 3.4, true, 'true', (x, y) => x == y)
    }, (err) => {
        equal(true, err.message.includes(`check invalid with 6 argument(s):`))
        equal(false, err.message.includes(`some argument(s) !== true`))
        equal(true, err.message.includes(`function evaluated to false`))
        equal(true, err.message.includes(`arg[0]: 'a'`))
        equal(true, err.message.includes(`arg[1]: 2`))
        equal(true, err.message.includes(`arg[2]: 3.4`))
        equal(true, err.message.includes(`arg[3]: true`))
        equal(true, err.message.includes(`arg[4]: 'true'`))
        equal(true, err.message.includes(`arg[5]: '(x, y) => x == y'`))
    })
    , throws("check booleans invalid output", () => {
        check(true, false)
    }, (err) => {
        equal(true, err.message.includes(`check invalid with 2 argument(s):`))
        equal(true, err.message.includes(`some argument(s) !== true`))
        equal(false, err.message.includes(`function evaluated to false`))
        equal(true, err.message.includes(`arg[0]: true`))
        equal(true, err.message.includes(`arg[1]: false`))
    })
]
