const ok_result = (description) => ({ description })

const error_result = (description, error) =>
    ({
        description,
        error,
        trace: error.stack ? error_origin(error) : error_origin()
    })

const error_origin = (err = new Error()) => {
    const sources = (err.stack || '\n indeterminate origin').split("\n").slice(1).reverse()
    const validation_frame = sources.filter(src => !src.includes('t3st-lib'))
    const err_source = validation_frame.reverse()[0] // safe [0] use since -> (err.stack || default)
    return err_source
}

const invalid_body = (additional_error = '') => {
    throw additional_error + 'invalid test !! expected test(string, { [async] function || promise || boolean } [,function])'
}

const test = (description = 'empty test', body = invalid_body, then_func = i => i) => {
    switch (typeof body) {
        case 'function':
            return function_test(description, body, then_func)
        case 'boolean':
            return body ? test_now(description, () => true, then_func) : error_result(description, '(false)')
        case 'object':
            if (body && body.constructor.name === 'Promise')
                return test_async(description, body, then_func)
        default:
            return test_now(description, () =>
                invalid_body(`unexpected body type in test(string, ${typeof body})\n\t--> `))
    }
}

const function_test = (description, body, then_func) => {
    switch (body.constructor.name) {
        case 'Function':
            return test_now(description, body, then_func)
        case 'AsyncFunction':
            return test_async(description, body(), then_func)
        default:
            throw 't3st::function_test constructor neither Function nor AsyncFunction'
    }
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
        if (typeof err !== 'object' || err.constructor.name !== 'Error') {
            err = new Error(`unexpected error [${err}]`)
        }
        err.message = 'Promise rejected >> ' + err.message
        throw err
    })
    .then((result) => then_func(result))
    .then(_ => ok_result(description))
    .catch(err => error_result(description, err))

const quote_wrap = (value) => typeof value === 'string' ? `'${value}'` : JSON.stringify(value)

const assert_hint_argument = () => {
    throw `assert(?,?) missing or undefined argument(s).
        You could explicitly state : assert(typeof something, 'undefined') or assert(true, !something)
        ~ Or did you intend to use : affirm([...propositions,] function => boolean) ?`
}

const assert_hint_alike = `\n\t\t~ To compare value objects use : alike(data, data)`

const assert = (assumption = assert_hint_argument(), expected = assert_hint_argument()) => {
    if (assumption !== expected) {
        const tA = typeof assumption
        const tE = typeof expected
        const type_error = (tA === tE) ? '' : ` !! Type mismatch: assert(${tA}, ${tE}).`
        const suggest_alike = tA === 'object' ? `${assert_hint_alike}` : ''
        throw `Evaluation [${quote_wrap(assumption)}] === [${quote_wrap(expected)}]${type_error}${suggest_alike}`
    }
    return true
}

const affirm = (...factors) => {
    if (factors.length === 0)
        throw 'affirm expected (...values, function => boolean)'
    const [assumption, ...reversed_propositions] = factors.reverse()
    const propositions = reversed_propositions.reverse()

    const error_message = evaluate(assumption, propositions)
    if (error_message) {
        const precondition = propositions.reduce((xs, s) => `${xs}\n\t--> ${quote_wrap(s)}`, error_message)
        throw `${precondition}\n\t--> Evaluation [${assumption}]`
    } else return true
}

const evaluate = (assumption, propositions) => {
    try {
        const ok = assumption(...propositions)
        if (typeof ok === 'boolean') {
            return ok ? '' : '!! false assertion'
        } else return '!! expected affirm(function => boolean), not affirm(function => truthy)'
    } catch (err) {
        return `!! affirm failed *before* assertion\n\t--> !! ${err}`
    }
}

const alike_hint = () => { throw `alike(?,?) missing or undefined argument(s).` }

const obj_string = (v) =>
    typeof v === 'object' && v !== null
        ? `{\n${
        Object.entries(v)
            .sort(([a_key, _a], [b_key, _b]) => a_key.localeCompare(b_key))
            .map(([key, val]) => `${key} : ${quote_wrap(obj_string(val))}`)
            .join(',\n')
        }}\n`
        : typeof v === 'function'
            ? `${v}`
            : v

const alike = (a = alike_hint(), b = alike_hint()) => assert(obj_string(a), obj_string(b))

module.exports = {
    test,
    assert,
    affirm,
    alike
}
