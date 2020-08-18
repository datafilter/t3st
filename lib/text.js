const result_text = result => {
    const isError = Object.prototype.hasOwnProperty.call(result, 'error')
    const outcome = isError ? 'error' : 'ok'
    const maybe_error = isError ? '\n\t--> caught: ' + result.error : ''
    const maybe_trace = isError ? '\n\t--> trace:\n\t' + result.trace : ''
    return `[${outcome}] ${result.description}${maybe_error}${maybe_trace}`
}

const summize = (results = [], verbose = false) => {

    const flat_results = results.flat(99)

    const omit = Symbol()

    const ok_results = flat_results.filter(r => r && !r.trace)
    const err_results = flat_results.filter(r => !r || !!r.trace)

    const message = (result, include_message) =>
        (!result || (typeof result.description === 'undefined'))
            // TODO if JSON.stringify == [Object object], quote wrap and/or toString that works with class objects
            ? `\nNot a test result: ${result} ${JSON.stringify(result)}\n-> Possibly missing test function, eg:\n-> test("description", () => {..code..})`
            : include_message ? `\n${result_text(result)}` : omit

    const messages = ok_results
        .map(m => message(m, verbose))
        .concat(err_results.map(m => message(m, true)))
        .filter(x => x !== omit)

    const total_err = err_results.length
    const total_ok = ok_results.length

    const ss = n => n == 1 ? '' : 's'
    const total_errors_or_green = total_err > 0 ? `..and ${total_err} [error${ss(total_err)}] ⚔️🔥` : '🥦'
    const overview = `${total_ok} test${ss(total_ok)} [ok] ${total_errors_or_green}`
    return `${overview}\n${messages.join('')}${messages.length > 10 ? '\n\n' + overview : ''}`
}

module.exports = {
    result_text,
    summize
}