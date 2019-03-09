const ok_result = (description) => {
    return { description: description }
}

const error_result = (description, err) => {
    const stack = err.stack ? '\nstack:\n' + err.stack : ''
    return {
        description: description,
        error: '' + err + stack
    }
}

const test = (description, func, then_func = x => x) =>
    typeof func === 'function' ?
        test_now(description, func, then_func)
        : test_async(description, func, then_func)


const test_now = (description, func, then_func) => {
    try {
        then_func(func())
        return ok_result(description)
    } catch (err) {
        return error_result(description, err)
    }
}

const test_async = (description, promise, then_func) => promise
    .then(result => result)
    .catch(err => {
        err.message = 'Promise rejected >> ' + err.message
        throw err
    })
    .then((result) => then_func(result))
    .then(_ => ok_result(description))
    .catch(err => error_result(description, err))

const quote_wrap = (value) => typeof value === 'string' ? `'${value}'` : value

const default_assumption = '__undefined_assumption'
const default_expected = '__undefined_expected'

const assert = (assumption = default_assumption, expected = default_expected) => {
    if (assumption !== expected) {
        if (assumption === default_assumption || expected === default_expected) {
            throw 'assert(?,?) missing or undefined argument(s). use assert(!!a,!!b) -or- assert_fun(() => truthy)'
        }
        const tE = typeof assumption
        const tA = typeof expected
        const type_error = (tE === tA) ? '' : ` !! Type mismatch: assert(${tE}, ${tA}).`
        throw `Evaluation [${quote_wrap(assumption)}] === [${quote_wrap(expected)}]${type_error}`
    }
    return true
}

const assert_eval = (assumption) => {
    try {
        if (!eval(assumption))
            throw `Evaluation [${assumption}]`
    } catch (err) {
        const eval_failure = `eval failed with (${err + ''}). Did you test assert(string, undefined) ?`
        throw `Evaluation [${assumption}] !! ${eval_failure}`
    }
}

const assert_fun = (assumption, message) => {
    if (typeof message === 'function') {
        const swap = assumption
        assumption = message
        message = swap
    }
    try {
        if (!assumption())
            throw false
    } catch (err) {
        const err_prefix = err ? `!! Test failed *before* assertion --> ${err}\n\t--> ` : ''
        const message_prefix = (typeof message !== 'undefined') ? message + '\n\t-->' : ''
        throw `${err_prefix}${message_prefix} Evaluation[${assumption}]`
    }
}

const result_text = result => {
    const prefix = result.error ? 'error' : 'ok'
    const postfix = result.error ? '\n\t--> ' + result.error : ''
    return `[${prefix}] ${result.description}${postfix}`
}

const tally_results = (label = '', ...results) => {
    if (typeof label !== 'string') {
        results = results.concat(label)
        label = ''
    }
    results = results.flat(99)

    const result_message = (result) =>
        (!result || !result.description) ? `\nNot a test result: ${result} ${JSON.stringify(result)}`
            : (result.error) ? `\n${result_text(result)}`
                : ''

    const error_messages = results.map(result_message).filter(x => x !== '')
    const total_err = error_messages.length
    const total_ok = results.length - total_err

    const ss = n => n == 1 ? '' : 's'
    const overview = `${total_ok} test${ss(total_ok)} [ok] ${total_err > 0 ? `..and ${total_err} [error${ss(total_err)}] ⚔️🔥` : '🥦'}`
    return `${label}${label ? ' ' : ''}${overview}\n${error_messages.join('')}`
}

module.exports = {
    test
    , assert
    , assert_fun
    , assert_eval
    , result_text
    , tally_results
}
