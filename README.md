<p align="center">
  <img src="https://github.com/devmachiine/npm-t3st/raw/master/play/t3st.png"/>
</p>

Most of the test framework code is [in this file on github](https://github.com/devmachiine/npm-t3st/blob/master/t3st-lib/validation.js)

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
### assert
> assert(a,b)
* compare 2 values are ===, throws on false/error
### affirm
> affirm(\[...values,\] function => boolean)
* run a function that throws if an expression is not true.
### result_text
> [ok | error] Test name
* create a message string from a test result
### tally_results
> [description] {n} test(s) ok [and n tests failed with: etc..]
* create a complete summary from a group of test results

To create a test script, you could use *require_tests*
```
(async () => {
  const { require_tests } = require('./index')
  console.log('-'.repeat(40))
  require_tests('./tests', 'framework')
})()
```
This picks up all .js files in the `./tests` folder given above, which all export test results.

For example in `error_origin.js`
```
module.exports = async ({ test, assert, affirm }) => [
    test("invalid test body type", () => {
        const missing_body = test("_")
        affirm(missing_body.trace, (trace) => trace.includes('error_origin.js'))
    })
    , test("error in test shows origin", () => {
        const undefined_dessert = test("_", () => dessert)
        affirm(undefined_dessert.trace, (trace) => trace.includes('error_origin.js'))
    })
]
```

There's no truthy or undefined tests.

Fuzzy assumptions can be explicitly stated with existing methods:
```javascript
test(`5 and '5' are basically the same thing, right?`, 5 == '5')
test("You didn't see any droids", () => typeof droids === 'undefined')
```

Or just create extra assertions diy
```
// maybe, when needed: extra data & fuzzy functions
const same = (assumption, expected) => assert(JSON.stringify(assumption), JSON.stringify(expected))
const asserty = (assumption, expected) => assert(true, assumption == expected)
```