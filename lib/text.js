const result_text = result => {
    const isError = Object.prototype.hasOwnProperty.call(result, 'error')
    const outcome = isError ? 'error' : 'ok'
    const maybe_error = isError ? '\n\t--> caught: ' + result.error : ''
    const maybe_trace = isError ? '\n\t--> trace:\n\t' + result.trace : ''

    const heading = `[${outcome}] ${result.description}`  // TODO show test line number/ref on next line.

    // null check as error can be anything. Todo, match symbol instead.
    // TODO do not print if silent
    if (isError && result.error && Object.prototype.hasOwnProperty.call(result.error, 'display')) {
        return {
            message: `${heading}${maybe_error}${maybe_trace}`,
            display: result.error.display
        }
    }

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

    const ok_results = flat_results.filter(r => r && !r.trace)
    const err_results = flat_results.filter(r => !r || !!r.trace)

    const non_result = (result) => ({
        message: `\nNot a test result: ${result} ${JSON.stringify(result)}\n-> Possibly missing test function, eg:\n-> test("description", () => {..code..})`,
        display: () => 0
    })

    const maybe_result_text = (result, include_message) =>
        (!result || (typeof result.description === 'undefined'))
            // TODO if JSON.stringify == [Object object], quote wrap and/or toString that works with class objects
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
    const overview = `${total_ok} test${ss(total_ok)} [ok] ${total_errors_or_green}`

    if (!silent)
        print_results(overview, result_texts)

    return `${overview}\n${result_texts.map(r => `\n` + r.message).join('')}${result_texts.length > 10 ? '\n\n' + overview : ''}`
}

module.exports = {
    result_text,
    report
}


