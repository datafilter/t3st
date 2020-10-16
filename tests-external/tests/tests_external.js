module.exports = async (framework) => {
    const demo_results = await require('../../play/demo')(framework)

    const path = require('path')

    const { test, equal, check, throws } = framework

    const { execSync } = require("child_process")
    const shell = (cmd) => execSync(cmd) + ''
    const t3st = (cli) => shell(`node ${require.main.filename} ${cli}`)

    const cli_tests = [
        test("ok tests print ok", () => {
            const t3st_output = t3st(`--dir ${path.resolve(__dirname, '../all_ok/')}`)
            check(t3st_output, o => o.includes('4 tests [ok]'))
        })
        , test("silent prints no output", () => {
            const t3st_output = t3st(`--dir ${path.resolve(__dirname, '../all_ok/')} --silent`)
            check(t3st_output, o => o === '')
        })
        , throws("unhandled promise rejection sets non-zero exit code", () => {
            const _t3st_output = t3st(`--dir ${path.resolve(__dirname, '../promise_rejected/')}`)
        }, (err) => {
            equal(err.status, 1)
            check(err.output + '', (o) => o.includes('⚔️🔥 Unhandled Rejection'))
            check(err.message, (m) => m.includes('Command failed'))
        })
        , throws("missing await in failing test gives hint", () => {
            const _na = t3st(`--dir ${path.resolve(__dirname, '../missing_await')}`)
        }, (err) => {
            equal(err.status, 1)
            check(err.message, m => m.includes('Command failed'))
            const output = err.output + ''
            check(output, o => o.includes('0 tests [ok] ..and 1 [error]'))
            check(output, o => o.includes("Possible missing 'await' statement before an async test"))
        })
        , throws("invalid javascript in file gives details", () => {
            const _na = t3st(`--dir ${path.resolve(__dirname, '../error_in_file')}`)
        }, (err) => {
            equal(err.status, 1)
            check(err.message, m => m.includes('Command failed'))
            const output = err.output + ''
            check(output, o => o.includes('caught: exception occurred *outside* of tests'))
            check(output, o => o.includes('SyntaxError:'))
            check(output, o => o.includes('tests-external/error_in_file/invalid_javascript.js:4'))
        })
    ]

    return [...cli_tests, ...demo_results]
}
