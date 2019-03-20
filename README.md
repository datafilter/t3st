<p align="center">
  <img src="https://github.com/devmachiine/npm-t3st/raw/master/play/t3st.png"/>
</p>

# Overview

t3st is a small & light javascript test framework written in ~210 lines of code, tested with ~210 asserts.

70% of the code in the repository is to test the test framework.

The main part is [in this single file on github](https://github.com/devmachiine/npm-t3st/blob/master/t3st-lib/validation.js)

You can run the tests that test the test framework:

```
git clone https://github.com/devmachiine/npm-t3st.git
cd npm-t3st
npm test
```

Messing around with the tests in the repo is better than reading any docs imho.

# Quickstart

Create a test file, say `test.js` with this code:

```javascript
const { run } = require('t3st')
run('./tests')
```

Install `t3st` in the same directory

```bash
npm install t3st
```

Create directory `tests` _(The directory name we passed to the run function)_

Inside that `tests` directory, paste this code to a file named `demo.js`:

_( [or right-click save-as from here](https://raw.githubusercontent.com/devmachiine/npm-t3st/master/play/demo.js) )_

```javascript
module.exports = async ({ test, assert, affirm }) => [

    // Hello World
    test("can be a simple boolean expression", 1 > 0)
    , test("doesn't print to console, it just returns a result", !!`truthy made boolean with !!`)

    // Fun Validation
    , test("passing in a function runs it", () => console.log('spooky side-effect'))
    , test("assert compares values with ===", () => {
        const five = 2 + 3
        assert(5, five)
    })
    , test("remove comments to view detailed output using affirm", () => {
        const a = 'some' //+ '?'
        const b = 5 //+ 1
        const c = { name: 'mark' }
        affirm(a, b, c.name.length, (text, number, name_length) => {
            return number == 5 && text.length >= name_length
        })
    })
    , test("assert and affirm return boolean ~ so you can chain them with &&",
        assert(true, true) && assert('ab', 'a' + 'b') && affirm(0, (zero, _ignored) => zero === 0))
    , test("there is an additional funciton body available after the first",
        () => {
            // throw "The continuation doesn't run if the first function fails"
            return 'something'
        },
        (thing) => assert(thing, 'something'))

    // Pinky Promise 
    , test("tests can be async", async () => {
        const foo = await 'important bar()'
    })
    , await test("async or promise test is async, but you don't have to await them", async () => { })
    , test("You can test a promise with a then",
        Promise.resolve(1).then(x => x === 1))
    , test("Or, use a continuation of the result like so:",
        Promise.resolve('bond'),
        (james) => {
            assert(james, 'bond')
        })
    , test("an async test is a promise", () => {
        const test_async = test("async", async () => { })
        affirm(test_async.constructor.name, (name) => name === 'Promise')
    })

    , [[[[test("results can be a little bit nested", true),
    [[test("so don't worry about flattening them", true)]]]]]]
]
```

Run the tests with [Node.js](https://www.w3schools.com/nodejs/nodejs_intro.asp)

```bash
node test.js
```

You can add more `.js` tests files (and organise them in directories) without extra config.

`run` sets an exit code of 1 if there were any errors.

# Brief summary

The tests in the repo are the *real* docs. But here's to writing practice 🍸

As far as possible, most of the test framework is 'pure functions' that only return data. It's quite flexible, and should be easy if you wanted to pump the test output to something sensible like a message queue instead of writing it to a file like we did back in the ~~70s~~ ~~80s~~ ~~90s~~, oh.. we still do that ?

Aside from `run` in the quickstart, the functions don't do much besides invoke the given functions and catch errors.

---
#### test-result
An object with a `description`, and if things went wrong, also an `error` : {description [,error]}

Both description and error can be anything other than string/Error.
#### test(description, boolean)
Basic test that expects the boolean to be true.
#### test(description, function => boolean)
Run a function that returns a boolean. It catches the first error, and returns a result.
#### assert(a,b)
Compare 2 values are ===, throws on false/error.
#### affirm(\[...values,\] function => boolean)
Run a function that throws if an expression is not true. It pretty prints given values to help with investigation.
#### result_text : [ok | error] Test name
Create a message string from a test result.
#### tally_results : [description] {n} test(s) ok [and n tests failed with: etc..]
Create a complete summary from a group of test results. Only the interesting bits: Number of tests ran, and info for all errors.

---

There's no truthy or undefined tests.

Fuzzy assumptions can be explicitly stated with existing methods:
```javascript
test(`5 and '5' are basically the same thing, right?`, 5 == '5')
test("You didn't see any droids", () => typeof droids === 'undefined')
```

Or just create extra assertions diy
```javascript
// maybe, when needed: extra data & fuzzy functions
const same = (assumption, expected) => assert(JSON.stringify(assumption), JSON.stringify(expected))
const asserty = (assumption, expected) => assert(true, assumption == expected)
```

Any feedback, bugs, questions, contributions or money is always welcome :)

```
PS. Why chrono over semantic versioning? Part of a WIP towards something better..
```