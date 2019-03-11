<p align="center">
  <img src="https://github.com/devmachiine/npm-t3st/raw/master/play/t3st.png"/>
</p>

The ~140 lines of test framework code is [here on github](https://github.com/devmachiine/npm-t3st/blob/master/index.js)

You can run the tests that test the test framework:

```
git clone https://github.com/devmachiine/npm-t3st.git
cd npm-t3st
npm test
```

Checking out the tests in the repo give the best examples, but here's a english description too:

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
Basic happy path test
```javascript
test("five is big", 5 > 1)
```
Assert compares with ====
```javascript
assert(actual, expected)
// if you are into saying things like: is blue the color of the sky ?   
// instead of just : is the sky blue ?
assert(expected, actual)
```
Eg.
```javascript
test_result = test(`2 + 3 = 5`, () => {
    const sum = 2 + 3
    assert(sum, 5)
})
```
> [ok] 2 + 3 = 5

Expected failing tests

```javascript
const err_eval_err = test(`show evaluation exception`, () => {
    undefined_variable
})

const err_throw = test(`show thrown error`, () => {
    throw 'ThrownError'
})
```
