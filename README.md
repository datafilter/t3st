<p align="center">
  <img src="https://github.com/devmachiine/npm-t3st/raw/master/play/t3st.png"/>
</p>

The ~120 lines of test framework code is [here on github](https://github.com/devmachiine/npm-t3st/blob/master/index.js)

You can run the tests that test the test framework:

```
git clone https://github.com/devmachiine/npm-t3st.git
cd npm-t3st
npm test
```

In words:

* test(description_string, () => function) : catch assert or other errors, and returns a result: {description [,error]}
* assert(a,b) : compare 2 values are ===, throws on false/error
* assert('string expression') : does !eval(expression), throws on false/error
* assert_fun(() => function) : run a function that throws if an expression is not truthy
* assert_fun(extra_description_string, () => function) : same as above with additional output
* result_text : create a single message from a test result
* tally_results : create a complete summary from a group of test results

Some examples:

```javascript
// Lets import
const { assert, test } = require('t3st')
```
Assert compares with ====
```javascript
assert(actual, expected)
// if you are into saying things like: is blue the color of the sky ?   
// instead of just : is the sky blue ?
assert(expected, actual)
```
Basic happy path test
```javascript
test_result = test(`2 + 3 = 5`, () => {
    const sum = 2 + 3
    assert(sum, 5)
})
```
> [ok] 2 + 3 = 5


Expected failing tests

```javascript
const err_eval = test(`show evaluation on error`, () => {
    assert_eval(`1 > 2`)
})

const err_eval_err = test(`show evaluation exception`, () => {
    assert(undefined_variable)
})

const err_throw = test(`show thrown error`, () => {
    throw 'ThrownError'
})
---
If you *really* need it, you could also use dynamic evaluation:
```javascript
const ok_test = test(`1 + 1 = 2`, () => {
    assert_eval(`${1 + 1} === 2`)
})
```
 > [ok] 1 + 1 = 2

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

assert_eval(`"a useful assertion error message" && ` + boolean_val)
```
