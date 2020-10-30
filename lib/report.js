const test_source = (trace) => trace
    .split('\n')
    .map(t => t.trim())
    .find(t => t.startsWith('at'))

const result_text = result => {
    const has_error = result.has_error
    const outcome = has_error ? 'error' : 'ok'
    const maybe_error = has_error ? '\n\t--> caught: ' + result.error : ''
    const maybe_trace = has_error ? '\n\t--> trace:\n\t' + result.trace : ''

    const heading = `[${outcome}] ${result.description}`  // TODO show test line number/ref on next line.

    if (result.has_validation_error) {
        const source = test_source(result.trace)
        return {
            message: `${heading}\n\t${source}\n\t${result.error.message}`,
            display: result.error.display
        }
    }

    if (result.is_file_parse_error) {
        const source = `at ${result.trace.split('\n').slice(0, 3).join('\n')}`
        return {
            message: `${heading}\n\t${source}\n\t${result.error}`,
            display: () => 0 //TODO move display onto error class, use error class and/or result in report.js?
        }
    }

    // TODO are these actual use cases?
    // console.log(result.trace.split('\n').find(() => true))

    return {
        message: `${heading}${maybe_error}${maybe_trace}`,
        display: () => 0
    }
}

const print_results = (overview, result_texts) => {
    console.log(overview)

    result_texts.forEach(r => {
        console.log(r.message)
        r.display()
    })

    if (result_texts.length > 10)
        console.log(overview)
}

const report = ({ results = [], noisy = false, silent = false } = {}) => {

    const flat_results = results.flat(99)

    const omit = Symbol()

    const ok_results = flat_results.filter(r => r && !r.has_error)
    const err_results = flat_results.filter(r => !r || r.has_error)

    // TODO -> show which file causes this error. 
    // possibly build report per file, and then print each as processed.
    // then --noisy could print:
    // file: filename
    // [ok] blabla..
    // ...
    // - - -
    // file: etc
    // ..
    const non_result = (result) => ({
        message: `\nNot a test result: ${result} ${JSON.stringify(result, null, 2)}` +
            `\n-> Possibly missing test function, eg:` +
            `\n-> test("description", () => {..code..})` +
            `\n->    or` +
            `\n-> test results from test file have undefined array values, eg:` +
            `\n-> return [,,test('a', () => equal(1,1)),,,]`,
        display: () => 0
    })

    const maybe_result_text = (result, include_message) =>
        (!result || (typeof result.description === 'undefined'))
            // TODO if JSON.stringify(o,null,2) == [Object object], quote wrap and/or toString that works with class objects
            ? non_result(result)
            : include_message ? result_text(result) : omit

    const result_texts = ok_results
        .map(m => maybe_result_text(m, noisy))
        .concat(err_results.map(m => maybe_result_text(m, true)))
        .filter(x => x !== omit)

    const total_err = err_results.length
    const total_ok = ok_results.length

    const ss = n => n == 1 ? '' : 's'
    const total_errors_or_green = total_err > 0 ? `..and ${total_err} [error${ss(total_err)}] ⚔️🔥` : '🥦'
    const overview = total_ok + total_err === 0
        ? "~ no tests found ⚔️🔥"
        : `${total_ok} test${ss(total_ok)} [ok] ${total_errors_or_green}`

    if (!silent)
        print_results(overview, result_texts)

    return `${overview}\n${result_texts.map(r => `\n` + r.message).join('')}${result_texts.length > 10 ? '\n\n' + overview : ''}`
}

module.exports = {
    result_text,
    report
}
