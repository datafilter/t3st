import { default as cjs } from '../../test-data/cjs.js'
import { hi } from '../../test-data/mjs.mjs'

// SyntaxError: Unexpected token 'export'
// import { hey } from '../../test-data/mjs.js'
// const hey = import('../../test-data/mjs.js')

const run_tests = ({ test, equal, jsmodule }) => {

    return [
        test("Module test supported.", () => equal(1 + 1, 2)),

        test("reference commonjs", () => equal(cjs.hi(), 'hello')),
        test("reference module", () => equal(hi(), 'world')),

        test("reference module named as .js", async () => {
            const { hey } = await jsmodule(import.meta.url, '../../test-data/mjs.js')
            equal('sup', hey())
        })
    ]
}

export default run_tests