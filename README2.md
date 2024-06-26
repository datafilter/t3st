<p align="center">
  <img src="https://github.com/datafilter/t3st/raw/master/play/t3st.png"/>
</p>
<h2 align="center"> A small & light javascript test framework </h2>

### What makes it different from other test frameworks?

* Get started with a single command
* Small self-evident codebase
* Clear brief output

# Quickstart

#### (1/2) Create test directory & test file

In a [Node.js](https://www.w3schools.com/nodejs/nodejs_intro.asp) project directory

Create a new directory called `tests` 

```bash
mkdir tests
```

Paste this test code into a new file under `tests/demo.js`:

```javascript
module.exports = async ({ test, equal, check, throws }) => [
    test("equal compares values with ===", () => {
        const five = 2 + 3
        equal(5, five)
    })
    , throws("expects erros to be thrown", () => {
        throw 'uncomment this line to cause failing test'
    })
    , await test("tests can be async", async () => {
        const james = await Promise.resolve('bond')
        equal(james, 'bond')
    })
]
```

#### (2/2) Run the tests

```bash
npx t3st
```

#### (3/2) More tests:

You can add more `.js` test files within your tests directory and its sub-directories.

For more examples [see the framework tests](https://github.com/datafilter/t3st/tree/master/tests)

If you'd like to specificy a directory for tests, add it as an argument:

```bash
npx t3st --dir other_dir
```

There is no need to install t3st anywhere, though doing so might save npx a second:
```bash
npm install t3st -g
```

To view all cli options, run:
```
npx t3st help
```

## Use with scripts / build servers:

`t3st` sets an exit code of `0` if all tests succeeded.

 An exit code of `1` is set when:
 * Any tests failed 
 * No tests are found
 * Unhandled promise rejections were detected.

Command line argument `-s` or `--silent` supresses printing output, so the only program artifact is the exit code.

## Functions

<!-- TODO examples -->
#### test(description, () => { ..code ..})
#### test(description, async () => { ..code ..})
Runs a given function. It catches an error, the test fails.
#### equal(a,b)
Compare that the data of two values are ===, including deepEquals of objects and function comparison. Throws on false/error.

For example `{ name: 'mark' }`. Made to compare [value objects](https://en.wikipedia.org/wiki/Value_object) (infamously known as DTO's), YMMV on objects with functions. Not intended for referential comparison. In other words - if two things are similar in value they are viewed as the same thing regardless of their shared/separate location(s) in memory.
#### check(\[...values,\] function => boolean)
Run a function that throws if an expression is not true. It pretty prints given values to help with investigation.

#### throws(description, () => { ..code ..} [, (error) => { ..code ..}])
Expects an error to be thrown in the first function. An optional second function runs like test() with the caught error as input.

## [Design/Contributing](https://github.com/datafilter/t3st/blob/master/docs/contributing.md)

---


[![License](https://img.shields.io/badge/license-MIT-black)](https://img.shields.io/badge/license-MIT-black)
 <!-- Todo make dynamic, eg update via Github actions on PR: -->
[![License](https://img.shields.io/badge/core%20LOC-~321-brightgreen)](https://img.shields.io/badge/core%20LOC-~321-brightgreen)

[![License](https://img.shields.io/badge/tests%20LOC-~723-lightgrey)](https://img.shields.io/badge/tests%20LOC-~723-lightgrey)


Any feedback, bugs, questions, contributions or money is always welcome :)