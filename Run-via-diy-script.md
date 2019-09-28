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
