const result_text = result => {
    const outcome = result.trace ? 'error' : 'ok'
    const maybe_error = result.trace ? '\n\t--> caught: ' + result.error : ''
    const maybe_trace = result.trace ? '\n\t--> trace:' + result.trace : ''
    return `[${outcome}] ${result.description}${maybe_error}${maybe_trace}`
}

const tally_results = (label = '', ...results) => {
    if (typeof label !== 'string') {
        results = results.concat(label)
        label = ''
    }
    const flat_results = results.flat(99)

    const non_error = {}

    const error_result = (result) =>
        (!result || (typeof result.description === 'undefined'))
            // TODO if JSON.stringify == [Object object], quote wrap and/or toString that works with class objects
            ? `\nNot a test result: ${result} ${JSON.stringify(result)}\n-> Possibly missing test function, eg:\n-> test("description", () => {..code..})`
            : (result.trace)
                ? `\n${result_text(result)}`
                : non_error

    const error_messages = flat_results.map(error_result).filter(x => x !== non_error)
    const total_err = error_messages.length
    const total_ok = flat_results.length - total_err

    const ss = n => n == 1 ? '' : 's'
    const total_errors_or_green = total_err > 0 ? `..and ${total_err} [error${ss(total_err)}] ⚔️🔥` : '🥦'
    const overview = `${total_ok} test${ss(total_ok)} [ok] ${total_errors_or_green}`
    return `${label}${label ? ' ' : ''}${overview}\n${error_messages.join('')}`
}

module.exports = {
    result_text,
    tally_results
}