const ok_result = (description) => ({ description })

const error_result = (description, error) =>
    ({
        description,
        error,
        trace: error && error.stack ? error_origin(error) : error_origin()
    })

const error_origin = (err = Error()) => {
    const sources = (err.stack || (new Error().stack)).split("\n").slice(1).reverse()
    // TODO test behaviour if non-standard Error.prototype.stack is undefined

    const path = require('path')
    const path_lib = path.join('t3st', 'lib')
    const path_cli = path.join('t3st', 'bin', 'cli.js')

    const more_helpful_frames = sources
        .filter(src => !src.includes(path_lib))
        .filter(src => !src.includes(path_cli))
        .filter(src => !src.includes('at processTicksAndRejections'))
        .reverse().join("\n\t")

    return more_helpful_frames === ''
        ? `Unknown error origin.\n\t > Possible missing 'await' statement before an async test:\n\t > await test(.., async () => {..})`
        : more_helpful_frames
}

const invalid_body = (additional_error = '') => {
    throw Error(additional_error + 'invalid test !! expected test(string, { function OR async function (not promise) })')
}

const test = (description = 'empty test', body = invalid_body) => {
    const t = typeof body
    const test_option =
        t === 'function' && test_function ||
        test_invalid_body
    return test_option(description, body)
}

const test_invalid_body = (description, body) =>
    test_now(description, () =>
        invalid_body(`unexpected body type in test(string, ${typeof body})\n\t--> `))

const test_function = (description, body) => {
    switch (body.constructor.name) {
        case 'Function':
            return test_now(description, body)
        case 'AsyncFunction':
            return test_async(description, body)
        default:
            throw Error('t3st::function_test constructor neither Function nor AsyncFunction')
    }
}

const test_now = (description, func) => {
    try {
        func()
        return ok_result(description)
    } catch (err) {
        return error_result(description, err)
    }
}

const test_async = async (description, async_func) => {
    try {
        await async_func()
        return ok_result(description)
    } catch (err) {
        return error_result(description, err)
    }
}

const quote_wrap = (value) => typeof value === 'string' || typeof value === 'function'
    ? `'${value}'` : JSON.stringify(value)

const assert_hint_argument = () => {
    throw Error(`assert(?,?) missing or undefined argument(s).
        You can test for an undefined x via : assert.undefined(x)
        ~ Or did you intend to use : affirm([...propositions,] function => boolean) ?`)
}

const assert_hint_alike = `\n\t\t~ To compare value objects use : alike(data, data)`

const assert = (assumption = assert_hint_argument(), expected = assert_hint_argument()) => {
    if (assumption !== expected) {
        const tA = typeof assumption
        const tE = typeof expected
        const type_error = (tA === tE) ? '' : ` !! Type mismatch: assert(${tA}, ${tE}).`
        const suggest_alike = tA === 'object' ? `${assert_hint_alike}` : ''
        throw Error(`Evaluation [${quote_wrap(assumption)}] === [${quote_wrap(expected)}]${type_error}${suggest_alike}`)
    } else return true
}

assert.undefined = u => (typeof u === 'undefined')
    ? true
    : (() => { throw Error(`Evaluation assert.undefined -> ${typeof u} [${quote_wrap(u)}]`) })()

// TODO (also in alike): Highlight first difference with ^^^ in error output
const affirm = (...factors) => {
    if (factors.length === 0)
        throw Error('affirm expected (...values, function => boolean)')
    const [assumption, ...reversed_propositions] = factors.reverse()
    const propositions = reversed_propositions.reverse()

    const error_message = evaluate(assumption, propositions)
    if (error_message) {
        const precondition = propositions.reduce((xs, s) => `${xs}\n\t--> ${quote_wrap(s)}`, error_message)
        throw Error(`${precondition}\n\t--> Evaluation [${assumption}]`)
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

const alike_hint = () => { throw Error(`alike(?,?) missing or undefined argument(s).`) }

const obj_string = (v) =>
    typeof v === 'object' && v !== null
        ? `{${
        Object.entries(v)
            .sort(([a_key, _a], [b_key, _b]) => a_key.localeCompare(b_key))
            .map(([key, val]) => `${key}:${quote_wrap(obj_string(val))}`)
            .join(', ')
        }}`
        : typeof v === 'function'
            ? `${v}`
            : v

const alike = (a = alike_hint(), b = alike_hint()) => assert(obj_string(a), obj_string(b))

const compare_objects = (a, b) => {
    const kA = Object.keys(a)
    if (kA.length !== Object.keys(b).length)
        throw_unequal(a, b)
    kA.every((k) => {
        if (!Object.prototype.hasOwnProperty.call(b, k))
            throw_unequal(a, b)
        equal(a[k], b[k])
    })
}

const compare_arrays = (a, b) =>
    a.length === b.length &&
    a.every((v, i) => equal(v, b[i])) || throw_unequal(a, b)

//todo return symbol checked by test instead.
const throw_unequal = (a, b) => {
    throw Error(`Evaluation [${quote_wrap(a)}] === [${quote_wrap(b)}]`)
}

const equal = (a = assert_hint_argument(), b = assert_hint_argument()) => {
    if (a !== b) {
        const tA = typeof a
        const tE = typeof b
        const type_diff = (tA === tE) ? '' : ` !! Type mismatch: equal(${tA}, ${tE}).`
        if (type_diff)
            throw Error(`Evaluation [${quote_wrap(a)}] === [${quote_wrap(b)}]${type_diff}`)
        if (tA === 'object') {
            if (Array.isArray(a) && Array.isArray(b)) {
                return compare_arrays(a, b)
            }
            return compare_objects(a, b)
        }
        if (tA === 'function' && ('' + a === '' + b)) {
            return true
        }
        else throw_unequal(a, b)
    } else return true
}

module.exports = {
    test,
    equal,
    assert,
    affirm,
    alike
}
