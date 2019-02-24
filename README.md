# t3st
What better documentation than actual running tests? :)
```javascript
// Lets import
const { assert, test, display_message } = require('t3st')
```
Basic happy path test
```javascript
test_result = test(`2 + 3 = 5`, () => {
    const sum = 2 + 3
    assert(sum, 5)
})
```
> [ok] 2 + 3 = 5
---
You could also use dynamic evaluation by passing a single string argument to assert
```javascript
const ok_test = test(`show [ok] on ok`, () => {
    const two = 2
    assert(`${two} === 2`)
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

Everything was printed with that **display_message** function we imported above as follows:

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
---
#### **tldr: Use assert(this,that)**

The code of the test framework [can be found here on github](https://github.com/devmachiine/npm-t3st/blob/master/index.js)

With a single argument, truth is asserted as:

```javascript
const assert = (assumption) => {
    if (!eval(assumption))
        throw `Evaluation [${assumption}]`
}
```
### An assert(eval) pitfall ~ and how to avoid it: 

```javascript
!!eval('n => n <= 1 ? 1 : even_undefined === 67')
```
> true

True? Because the whole thing is evaluated to a `function`


A function filled with a `[Uncaught ReferenceError: even_undefined is not defined]` ticking timebomb,
but a truthy value nonetheless.

Wrapping the comparisons in some brackets resolves this:

```javascript
!!eval('(n => n <= 1 ? 1 : even_undefined) === (67)')
```
> false

Another way to avoid this trap, is to evaluate them before passing them into assert:
```javascript
boolean_val = (n => n <= 1 ? 1 : even_undefined) === (67)

assert(`"a useful assertion error message" && ` + boolean_val)
```
Or you could use assert like this!
```javascript
assert((n => n <= 1 ? 1 : even_undefined), 67)
assert('this value', "that value")

assert(actual, expected)
// if you are into saying things like: is blue the color of the sky ?   
// instead of just : is the sky blue ?
assert(expected, actual)
```
Improvements, suggestions ? [Submit a pull request or propose a solution here.](https://github.com/devmachiine/npm-t3st/issues)
