# Fork / Play

The main part of the test framework is in [this file on github](https://github.com/devmachiine/t3st/blob/master/lib/validation.js). Most of the code in the project are tests to test the test framework.

Run the tests that test the test framework:

```
git clone https://github.com/devmachiine/t3st.git
cd t3st
npm test
```

Show live tests: Open with a terminal in the project dir and run:
```
npx nodemon -x "clear;date;npm test"
```
or if `t3st` is installed globally
```
nodemon -x "clear;date;t3st && t3st play"
```

# Design

The tests in the repo are the *real* docs. But here's to writing practice 🍸

`run` runs tests in the given path. It only yields individual tests when errors occur, as showing which tests passed on each run just becomes noisy information after a while.

Aside from `run` in the quickstart, the tests only invoke the given functions, catch errors and return a result. They don't print to screen or cause other side effects.

This makes the codebase quite flexible, and it should be easy if you wanted to pump the test output to something other than display. Eg a message queue or a file.

There are no truthy assertions.

Fuzzy assumptions can be explicitly stated with existing methods:
```javascript
test(`5 and '5' are basically the same thing`, 5 == '5')
```

You can create and use your own fuzzy assertion functions if you want:

```javascript
const truthy = (something) => equal(true, !!something)
const truthy_equal = (assumption, expected) => equal(true, assumption == expected)
```

---

## Types

#### test-result
An object with a `description`, and if things went wrong, also an `error` : {description [,error]}

Both description and error can be anything other than string/Error.

#### result_text : [ok | error] Test name
Create a message string from a test result.
#### tally_results : [description] {n} test(s) ok [and n tests failed with: etc..]
Create a complete summary from a group of test results. Only the interesting bits: Number of tests ran, and info for all errors.

## Debugging

.vscode launch.json:

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/t3st/bin/cli.js",
            "args": ["${workspaceFolder}/t3st"]
            // "cwd": "${workspaceFolder}/t3st"
        }
    ]
}
```