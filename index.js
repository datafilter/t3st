const ok_result = (description) => {
    return { description: description }
}

const error_result = (description, err) => {
    let stack = err.stack ? '\nstack:\n' + err.stack : ''
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

const assert = (assumption, expected) => {
    if (typeof expected !== 'undefined') {
        if (assumption !== expected)
            throw `Evaluation [${quote_wrap(assumption)}] === [${quote_wrap(expected)}]`
    } else if (typeof assumption !== 'string') {
        let unexpected_type_message =
            `Use assert(boolean, !!something) to assert truthy values.
            (PEP 20 ~ explicit is better than implicit)
            
            Did you intend to use assert_fun([name,] function) ?`
        throw unexpected_type_message
    }
    else if (!eval(assumption))
        throw `Evaluation [${assumption}]`
}

const assert_fun = (assumption, message) => {
    if (typeof message === 'function') {
        let swap = assumption
        assumption = message
        message = swap
    }
    try {
        if (!assumption())
            throw false
    } catch (err) {
        let err_prefix = err ? `!! Test failed *before* assertion --> ${err}\n\t--> ` : ''
        let message_prefix = (typeof message !== 'undefined') ? message + '\n\t-->' : ''
        throw `${err_prefix}${message_prefix} Evaluation[${assumption}]`
    }
}

const result_text = result => {
    let prefix = result.error ? 'error' : 'ok'
    let postfix = result.error ? '\n\t--> ' + result.error : ''
    return `[${prefix}] ${result.description}${postfix}`
}

const tally_results = (name, ...results) => {
    if (typeof name !== 'string') {
        results.unshift(name)
        name = ''
    } else {
        name += " "
    }
    let ok_tests = 0, err_tests = 0, error_messages = ''
    results.forEach(result => {
        if (!result || !result.description) {
            error_messages += `\nNot a test result: ${result} ${JSON.stringify(result)}`
            err_tests++
        }
        else if (result.error) {
            error_messages += `\n${result_text(result)}`
            err_tests++
        }
        else ok_tests++
    })
    let ss = n => n == 1 ? '' : 's'
    let overview = `${ok_tests} test${ss(ok_tests)} [ok] ${err_tests > 0 ? `..and ${err_tests} [error${ss(err_tests)}] ⚔️🔥` : '🥦'}`
    return `${name}${overview}\n${error_messages}`
}

module.exports = {
    test
    , assert
    , assert_fun
    , result_text
    , tally_results
};
