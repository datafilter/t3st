
## What is it ?

A minimal javascript test framework.

* Concise output by default
* Command line interface with watch mode
* Integration with ci/cd pipelines
* < 50 kB

# How to use it

Create or navigate to a [Node.js](https://www.w3schools.com/nodejs/nodejs_intro.asp) project directory
```
mkdir my-project
cd my-project
npm init -y
```

Install `t3st` _(optional, but recommended)_
```
npm i -d t3st
```

Generate a test
```
npx t3st gen hello
```
The above command creates a test file `hello.js` similar to this:
```javascript
module.exports = async ({ test, throws, equal, check }) => {

    // const unit = require('...')

    return [
        test("description", () => {
            equal(2, 1 + 1)
            check(1, 1 + 1, (a, b) => a + b == 3)
        }),
        , throws("expects erros to be thrown", () => {
            throw 'uncomment this line to cause failing test'
        })
        , await test("async test has to be awaited.", async () => {
            equal({}, {})
        })]
}
```

Run the tests
 ```
npx t3st
 ```   

Continuously re-run the tests when any code changes
```
npx t3st -w
```

Edit `tests/hello.js` to see output for failing tests.

---

Add the noisy `-n` flag to get more output
```
npx t3st -n
```

View command line documentation via the terminal
```
npx t3st help
```

## Use with scripts / build servers:

`t3st` sets an exit code of `0` if all tests succeeded.

An exit code of `1` is set when:
* Any tests failed 
* No tests are found
* Unhandled promise rejections were detected.

To prevent writing output to the console, use the silent option `-s` or `--silent` (just the error code is set).

To specify a different directory than `$(pwd)/tests` use the `-d` or `--dir` option.

 Project [clia](https://www.npmjs.com/package/clia) is an example of how `t3st` can be used on a build server, with this CI/CD [github workflow definition](https://github.com/datafilter/clia/actions/runs/308972687/workflow) and this [package.json](https://github.com/datafilter/clia/blob/master/package.json) config.

## How it works

`t3st` recursively reads all javascript test files in a directory and imports them.

Each test exports a default function, which is invoked with the framework validation functions as arguments.

Executed tests produce a collection of test results:
- Passing tests, objects with a single property: { description }
- Failing tests, objects with other additional properties, eg. { description, error, .. }

These results are used to build up a report to display for the user.

## Development / Future work

After cloning the repository run `npm ci` _(to install dependency `clia`)_, then run `npm test` to test t3st.

Stand alone tests aren't supported _(yet?)_, a good alternative is [here](https://github.com/tapjs/node-tap)

Keeping the test framework small, yet feature rich-enough is a balancing act between scope-creep and simplicity.

If you miss a feature that you really need or find a bug, please reach out / send a PR.


