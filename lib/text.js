const result_text = result => {
    const outcome = result.error ? 'error' : 'ok'
    const maybe_error = result.error ? '\n\t--> ' + result.error : ''
    const maybe_stack = result.error && result.error.stack ?
        '\nstack:\n' + result.error.stack : ''
    return `[${outcome}] ${result.description}${maybe_error}${maybe_stack}`
}

const tally_results = (label = '', ...results) => {
    if (typeof label !== 'string') {
        results = results.concat(label)
        label = ''
    }
    const flat_results = results.flat(99)

    const result_message = (result) =>
        (!result || !result.description) ? `\nNot a test result: ${result} ${JSON.stringify(result)}`
            : (result.error) ? `\n${result_text(result)}`
                : ''

    const error_messages = flat_results.map(result_message).filter(x => x !== '')
    const total_err = error_messages.length
    const total_ok = flat_results.length - total_err

    const ss = n => n == 1 ? '' : 's'
    const overview = `${total_ok} test${ss(total_ok)} [ok] ${total_err > 0 ? `..and ${total_err} [error${ss(total_err)}] ⚔️🔥` : '🥦'}`
    return `${label}${label ? ' ' : ''}${overview}\n${error_messages.join('')}`
}

module.exports = {
    result_text,
    tally_results
}