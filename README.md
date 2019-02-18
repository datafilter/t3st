# t3st
What better documentation than actual running tests? :)
```javascript
// Lets import
const { assert, test, display_message } = require('./index')
```
Basic happy path test

```javascript
const ok_test = test(`show [ok] on ok`, () => {
    const two = 2
    assert(`${two} == 2`)
})
```
 > [ok] show [ok] on ok

Expected failing tests

```javascript
const err_eval = test(`show evaluation on error`, () => {
    assert(`1 > 2`)
})

const err_eval_err = test(`show evaluation exception`, () => {
    assert(undefined_variable)
})

const err_throw = test(`show thrown error`, () => {
    throw 'ThrownError'
})
```

 > [error] show evaluation on error --> Evaluation [1 > 2]

 > [error] show evaluation exception --> ReferenceError: undefined_variable is not defined

 > [error] show thrown error --> ThrownError

Now, lets test all the above tests with one mega-test

```javascript
const ok_test_tests = test(`test functions yield expected results with correct messages`, () => {
    const test_test = (result, expected_assert, expected_message) => {
        const passed = !result.error
        const message = display_message(result)
        assert(`${passed === expected_assert} && '${result.description}'`)
        assert(`'${message}' === '${expected_message}'`)
    }
    test_test(ok_test, true, '[ok] show [ok] on ok')
    test_test(err_eval, false, '[error] show evaluation on error --> Evaluation [1 > 2]')
    test_test(err_eval_err, false, '[error] show evaluation exception --> ReferenceError: undefined_variable is not defined')
    test_test(err_throw, false, '[error] show thrown error --> ThrownError')
})
```
 > [ok] test functions yield expected results with correct messages

Everything was printed with that **display_message** we imported above as follows:

```javascript
const display = (test) => console.log(display_message(test))

console.log('Expected failing tests:\n')
display(err_eval)
display(err_eval_err)
display(err_throw)
console.log('\nExpected passing tests:\n')
display(ok_test)
display(ok_test_tests)
```

By themselves test functions return a result and don't cause a side-effect.

Here's the full [code  of the test framework](https://github.com/devmachiine/npm-t3st/blob/master/index.js)

```javascript
const assert = (assumption) => {
    if (!eval(assumption))
        throw `Evaluation [${assumption}]`
}

const test = (description, func) => {
    try {
        func()
        return { description: description }
    } catch (err) {
        return { description: description, error: err }
    }
}

const display_message = test => {
    let prefix = test.error ? 'error' : 'ok'
    let postfix = test.error ? ' --> ' + test.error : ''
    return `[${prefix}] ${test.description}${postfix}`
}

module.exports = {
    assert,
    test,
    display_message
}
```


