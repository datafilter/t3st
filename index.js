const assert = (assumption) => {
    if (!eval(assumption))
        throw `Evaluation [${assumption}]`
}

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