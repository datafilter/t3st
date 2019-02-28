const assert = (assumption, expected) => {
    if (typeof expected !== 'undefined') {
        if (assumption !== expected)
            throw `Evaluation [${quote_wrap(assumption)}] === [${quote_wrap(expected)}]`
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

module.exports = {
    assert,
    test,
    display_message
}