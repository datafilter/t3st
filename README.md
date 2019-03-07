<p align="center">
  <img src="https://github.com/devmachiine/npm-t3st/raw/master/play/t3st.png"/>
</p>

It'll be quicker to review the ~100 lines of test framework code [here on github](https://github.com/devmachiine/npm-t3st/blob/master/index.js)

You can run the tests that test the test framework:

```
git clone https://github.com/devmachiine/npm-t3st.git
cd t3st
npm test
```

In words:

* assert : compare 2 values or a single expression, throws on false/error
* assert_fun : run a function that throws if an expression is not truthy
* test : catch assert or other errors, and returns a result: {description [,error]}
* result_text : create a single message from a test result
* tally_results : create a complete summary from a group of test results

Some examples:

```javascript
// Lets import
const { assert, test } = require('t3st')
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



---


### An assert(eval) pitfall ~ and how to avoid it: (**tldr: Use assert(this,that)**)

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