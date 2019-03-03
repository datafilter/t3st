const assert = (assumption, expected) => {
    if (typeof expected !== 'undefined') {
        if (assumption !== expected)
            throw `Evaluation [${quote_wrap(assumption)}] === [${quote_wrap(expected)}]`
    } else if (typeof assumption !== 'string') {
        throw 'Use assert(boolean, !!something) to assert truthy values. (PEP 20 ~ explicit is better than implicit)'
    }
    else if (!eval(assumption))
        throw `Evaluation [${assumption}]`
}

const quote_wrap = (value) => typeof value === 'string' ? `'${value}'` : value

const test = (description, func) => {
    try {
        func()
        return { description: description }
    } catch (err) {
        return { description: description, error: err }
    }
}

const display_message = test => {
    let prefix = test.error ? 'error' : 'ok'
    let postfix = test.error ? ' --> ' + test.error : ''
    return `[${prefix}] ${test.description}${postfix}`
}

const result_text = test_result => {
    let short_message = display_message(test_result)
    let postfix_stack = test_result.error_stack ? '\nstack:\n' + test_result.error_stack : ''
    return `${short_message}${postfix_stack}`
}

let tally_results = (name, ...results) => {
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
    let ss = n => n > 1 ? 's' : ''
    let overview = `${ok_tests} test${ss(ok_tests)} [ok] ${err_tests > 0 ? `..and ${err_tests} [error${ss(err_tests)}] ⚔️ 🔥` : '🌼'}`
    return `${name}${overview}\n${error_messages}`
}

module.exports = {
    assert,
    test,
    display_message,
    tally_results
}