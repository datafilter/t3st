module.exports = async (framework) => {
    const demo_results = await require('../../play/demo')(framework)

    const path = require('path')

    const { test, equal, check, throws } = framework

    const { execSync } = require("child_process")
    const shell = (cmd) => execSync(cmd) + ''
    const t3st = (cli) => shell(`node ${require.main.filename} ${cli}`)

    const cli_display = [
        test("x prints test t3st command", () => {
            const t3st_output = t3st(`-x`).trim()

            const unix = `nodemon -q -x "node bin/cli.js -c --watch_mode=true"`
            const win32 = `nodemon -q -x "node bin\\cli.js -c --watch_mode=true"`

            const platform_cmd = require('os').platform() === 'win32' ? win32 : unix

            equal(t3st_output, platform_cmd)
        })
    ]

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
            check(err.message, (m) => m.includes('Command failed'))
        })
        , throws("missing await in failing test still finds error origin", () => {
            const _na = t3st(`--dir ${path.resolve(__dirname, '../missing_await')}`)
        }, (err) => {
            equal(err.status, 1)
            check(err.message, m => m.includes('Command failed'))
            const output = err.output + ''
            check(output, o => o.includes('0 tests [ok] ..and 1 [error]'))
            check(output, o => !o.includes("Possible missing 'await' statement before an async test"))
            check(output, o => o.includes('async_without_await.js'))
        })
        , throws("invalid javascript in file gives details", () => {
            const _na = t3st(`--dir ${path.resolve(__dirname, '../error_in_file')}`)
        }, (err) => {
            equal(err.status, 1)
            check(err.message, m => m.includes('Command failed'))
            const output = err.output + ''
            check(output, o => o.includes('exception occurred *outside* of tests'))
            check(output, o => o.includes('SyntaxError:'))

            const path = require('path')
            const path_error_file = path.join('tests-external', 'error_in_file', 'invalid_javascript.js')

            check(output, o => o.includes(`${path_error_file}:4`))
        })
    ]

    const test_filter_dir = `-n --dir ${path.resolve(__dirname, '../filter')}`

    const command_tests = [
        test("filter not specified defaults to (.mjs .js)", () => {
            const no_filter = t3st(`${test_filter_dir}`)
            check(no_filter, o => o.includes('(.mjs .js)')
                && o.includes('4 tests [ok]')
                && o.includes('a-ok')
                && o.includes('b-ok')
                && o.includes('c-ok')
                && o.includes('d-ok')
            )
        })
        , test("filter endswith with when pattern starts with .", () => {
            const ext_js_filter = t3st(`-f .ext.js ${test_filter_dir}`)
            check(ext_js_filter, o => o.includes('(.ext.js)')
                && o.includes('2 tests [ok]')
                && o.includes('a-ok')
                && o.includes('b-ok')
            )
        })
        , test("filter includes when pattern doesnt start with .", () => {
            const includes_filter = t3st(`-f ext mjs ${test_filter_dir}`)
            check(includes_filter, o => o.includes('(ext mjs)')
                && o.includes('3 tests [ok]')
                && o.includes('a-ok')
                && o.includes('b-ok')
                && o.includes('d-ok')
            )
        })
    ]

    return [...command_tests, ...cli_display, ...cli_tests, ...demo_results]
}
