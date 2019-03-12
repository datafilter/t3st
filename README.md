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

Checking out the tests in the repo give the best examples.

Some extracts:

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
test(`2 + 3 = 5`, () => {
    const sum = 2 + 3
    assert(sum, 5)
})
```
> [ok] 2 + 3 = 5

Expected failing tests

```javascript
test(`show evaluation exception`, () => {
    undefined_variable
})

test(`show thrown error`, () => {
    throw 'ThrownError'
})
```

The tests in the repo are the *real* docs ~ here's a brief incomplete summary:

### test
> test(description, boolean)
* expects the boolean to be true.
> test(description, function => boolean)
* catch assert or other errors, and returns a result: {description [,error]}
### assert(a, b)
> assert(a,b)
* compare 2 values are ===, throws on false/error
### affirm([string,] function => boolean)
> affirm(\[...propositions,\] function => boolean)
* run a function that throws if an expression is not true.
### result_text
> result_text
* create a message string from a test result
### tally_results
> tally_results
* create a complete summary from a group of test results

There's no truthy or undefined tests.

Fuzzy assumptions can be explicitly stated with existing methods:
```javascript
test(`5 and '5' are basically the same thing, right?`, 5 == '5')
test("You didn't see any droids", () => typeof droids === 'undefined')
```