const ok_result = (description) => {
    return { description: description }
}

const error_result = (description, err) => {
    return {
        description: description,
        error: err
    }
}

const missing_body = () => {
    throw 'invalid test !! expected test(string, { promise || [async] function } [,function])'
}

const test = (description = 'empty test', func = missing_body, then_func = x => x) => {

    return typeof func === 'function' ?
        test_now(description, func, then_func)
        : test_async(description, func, then_func)
}

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
            throw 'assert(?,?) missing or undefined argument(s). Did you want to use assert_fun(function => boolean)?'
        }
        const tE = typeof assumption
        const tA = typeof expected
        const type_error = (tE === tA) ? '' : ` !! Type mismatch: assert(${tE}, ${tA}).`
        throw `Evaluation [${quote_wrap(assumption)}] === [${quote_wrap(expected)}]${type_error}`
    }
    return true
}

const err_eval_truthy = new Error('expected assert_eval(expression => boolean), not assert_eval(expression => truthy)')
const err_eval_empty = new Error('assert_eval(?) missing or undefined expression. use !! to evaluate truthy values')

const assert_eval = (assumption) => {
    try {
        if (typeof assumption === 'undefined')
            throw err_eval_empty
        const ok = eval(assumption)
        if (typeof ok !== 'boolean') {
            throw err_eval_truthy
        }
        if (ok) return true
        else throw 'false'
    } catch (err) {
        const eval_failure = `(${err + ''})`
        throw `Evaluation [${assumption}] !! ${eval_failure}`
    }
}

const err_fun_truthy = new Error('expected assert_fun(function => boolean), not assert_fun(function => truthy)')
const err_empty = new Error('____todo-refactor-t3st-magic-strings')

const assert_fun = (assumption, message) => {
    if (typeof message === 'function') {
        const swap = assumption
        assumption = message
        message = swap
    }
    try {
        const ok = assumption()
        if (typeof ok !== 'boolean') {
            throw err_fun_truthy
        }
        if (ok) return true
        else throw err_empty
    } catch (err) {
        const err_prefix = err !== err_empty && err !== err_fun_truthy ?
            `!! Test failed *before* assertion --> ${err}\n\t--> `
            : err === err_empty ? '' : err
        const message_prefix = (typeof message !== 'undefined') ? message + '\n\t--> ' : ''
        throw `${err_prefix}${message_prefix}Evaluation [${assumption}]`
    }
}

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
    test
    , assert
    , assert_fun
    , assert_eval
    , result_text
    , tally_results
}
