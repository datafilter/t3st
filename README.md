<p align="center">
  <img src="https://github.com/devmachiine/npm-t3st/raw/master/play/t3st.png"/>
</p>
<h2 align="center"> A small & light javascript test framework </h2>

# Quickstart

### (1/4) Install

Install [Node.js](https://www.w3schools.com/nodejs/nodejs_intro.asp) and t3st

```bash
npm install t3st
```

### (2/4) - Create an entrypoint file & test directory

Eg. `test.js` and `/tests` in this quickstart. (Choose other names if you like)

Put this in a new file called `test.js`

```javascript
const { run } = require('t3st')
run('./tests')
```
and create the directory

```bash
mkdir tests
```

### (3/4) Add a test in the test directory

Paste this code into a new file under `tests/demo.js`:

```javascript
module.exports = async ({ test, assert, affirm }) => [
    test("hello world", 1 > 0)
    , test("assert compares values with ===", () => {
        const five = 2 + 3
        assert(5, five)
    })
]
```

### (4/4) Run the tests

Call the entrypoint

```bash
node test.js
```

`run` sets an exit code of 1 if there were any failed tests.

### (5/4) More tests:

You can add more `.js` test files (and organise them in nested sub-directories) in the tests directory.

For more examples like async and promises, see <a href="https://raw.githubusercontent.com/devmachiine/npm-t3st/master/play/demo.js" download> this file.</a>

For all examples [see the framework tests](https://github.com/devmachiine/npm-t3st/tree/master/tests)


# Fork / Play

The main part of the test framework is in [this file on github](https://github.com/devmachiine/npm-t3st/blob/master/t3st-lib/validation.js). Most of the code in the project are tests to test the test framework ~ roughly an assert for each line of framework code. Tests beats docs imho.

To run the tests that test the test framework:

```
git clone https://github.com/devmachiine/npm-t3st.git
cd npm-t3st
npm test
```

# Design docs

The tests in the repo are the *real* docs. But here's to writing practice 🍸

Aside from `run` in the quickstart, the tests only invoke the given functions, catch errors and return a result. They don't print to screen or cause other side effects.

This makes the codebase quite flexible, and it should be easy if you wanted to pump the test output to something other than display. Eg a message queue or a file.

There are no truthy or undefined assertions.

Fuzzy assumptions can be explicitly stated with existing methods:
```javascript
test(`5 and '5' are basically the same thing, right?`, 5 == '5')
test("You didn't see any droids", () => typeof droids === 'undefined')
```

Or you can create fuzzy assertions if you want:

```javascript
const truthy = (something) => assert(true, !!something)
const asserty = (assumption, expected) => assert(true, assumption == expected)
```

---

## Types

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
#### alike(a,b)
Compare the data of two values. For example `{ name: 'mark' }`. Made to compare DTO's, YMMV on objects with functions. Not intended for referential comparison. In other words - if two things are similar in value they are viewed as the exact same thing regardless of their shared/separate location(s) in memory.
#### result_text : [ok | error] Test name
Create a message string from a test result.
#### tally_results : [description] {n} test(s) ok [and n tests failed with: etc..]
Create a complete summary from a group of test results. Only the interesting bits: Number of tests ran, and info for all errors.

---

Any feedback, bugs, questions, contributions or money is always welcome :)
