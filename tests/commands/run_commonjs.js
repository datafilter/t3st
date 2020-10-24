const { hi } = require('../../test-data/cjs')
const mjs = import('../../test-data/mjs.mjs')

// SyntaxError: Unexpected token 'export'
// const { hey } = require('../../test-data/mjs.js')
// const hey = import('../../test-data/mjs.js')

const run_tests = ({ test, equal, jsmodule }) => [
    test("Commonjs test supported.", () => equal(1 + 1, 2)),

    test("reference commonjs", () => equal(hi(), 'hello')),
    test("reference module", async () => {
        const { hi } = await mjs
        equal(hi(), 'world')
    }),

    test("reference module named as .js", async () => {
        const { hey } = await jsmodule(__filename, '../../test-data/mjs.js')
        equal('sup', hey())
    })
]

module.exports = run_tests