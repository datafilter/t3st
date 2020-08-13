module.exports = async (framework) => {
    const demo_results = await require('../../play/demo')(framework)

    const path = require('path')

    const { test, assert, affirm } = framework

    const { execSync } = require("child_process")
    const shell = (cmd) => execSync(cmd) + ''
    const t3st = (cli) => shell(`node ${require.main.filename} ${cli}`)

    const cli_tests = [
        test("ok tests print ok", () => {
            const t3st_output = t3st(`--dir ${path.resolve(__dirname, '../all_ok/')}`)
            affirm(t3st_output, o => o.includes('4 tests [ok]'))
        })
        , test("silent prints no output", () => {
            const t3st_output = t3st(`--dir ${path.resolve(__dirname, '../all_ok/')} --silent`)
            affirm(t3st_output, o => o === '')
        })
        , test("missing await in failing test gives hint", () => {
            const fail_t3st = test("_", () => {
                try {
                    const _na = t3st(`--dir ${path.resolve(__dirname, '../missing_await')}`)
                } catch (err) {
                    throw {
                        'status': err.status,
                        'message': err.message,
                        'output': err.output + ''
                    }
                }
            })
            assert(fail_t3st.error.status, 1)
            affirm(fail_t3st.error.message, m => m.includes('Command failed'))
            affirm(fail_t3st.error.output, o => o.includes('0 tests [ok] ..and 1 [error]'))
            affirm(fail_t3st.error.output, o => o.includes("Possible missing 'await' statement before an async test"))
        })
    ]

    return [...cli_tests, ...demo_results]
}
