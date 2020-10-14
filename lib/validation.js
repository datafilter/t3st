const ok_result = (description) => ({ description })

class ValidationError extends Error {
    display() { }
}

const error_result = (description, error) =>
    ({
        description,
        is_error: true,
        error,
        trace: error && error.stack ? error_origin(error) : error_origin(),
        is_validation_error: error instanceof ValidationError
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
    throw new ValidationError(additional_error + 'invalid test !! expected test(string, { function OR async function (not promise) })')
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
            throw new ValidationError('t3st::function_test constructor neither Function nor AsyncFunction')
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

const expect_error = (f) => {
    const not_thrown = Symbol()
    try {
        f()
        throw not_thrown
    } catch (err) {
        if (err === not_thrown) {
            throw new ValidationError("did not throw expected error")
        }
        else return err
    }
}

const throws = (description, f, maybe_check = i => i) => test(description, () => {
    const err = expect_error(f)
    maybe_check(err)
})

const quote_wrap = (value) => typeof value === 'string' || typeof value === 'function'
    ? `'${value}'` : JSON.stringify(value)

const evaluate = (assumption, propositions) => {
    const tA = typeof assumption
    const validate = tA === 'function'
        ? () => assumption(...propositions)
        : tA === 'boolean'
            ? () => assumption === true && propositions.every(p => p === true)
            : (() => {
                throw new ValidationError(`check doesn't support (...booleans, ${typeof assumption}).` +
                    `\nCheck last argument must be either function or boolean.`)
            })()
    try {
        const ok = validate()
        if (typeof ok === 'boolean') {
            return ok ? '' : '!! false assertion'
        } else return '!! expected check(function => boolean), not check(function => truthy)'
    } catch (err) {
        return `!! check failed *before* assertion\n\t--> !! ${err}`
    }
}

// TODO (also in equal): Highlight first difference with ^^^ in error output
const check = (...factors) => {
    if (factors.length === 0)
        throw new ValidationError('check expected (...values [, function => boolean])')
    const [assumption, ...reversed_propositions] = factors.reverse()
    const propositions = reversed_propositions.reverse()

    const error_message = evaluate(assumption, propositions)

    if (error_message) {
        const precondition = propositions.reduce((xs, s) => `${xs}\n\t--> ${quote_wrap(s)}`, error_message)
        throw new ValidationError(`${precondition}\n\t--> Evaluation [${assumption}]`)
    } else return true
}

// const obj_string = (v) =>
//     typeof v === 'object' && v !== null
//         ? `{${
//         Object.entries(v)
//             .sort(([a_key, _a], [b_key, _b]) => a_key.localeCompare(b_key))
//             .map(([key, val]) => `${key}:${quote_wrap(obj_string(val))}`)
//             .join(', ')
//         }}`
//         : typeof v === 'function'
//             ? `${v}`
//             : v

const compare_objects_value = (a, b) => {
    const kA = Object.keys(a)
    return kA.length === Object.keys(b).length &&
        kA.every((k) =>
            Object.prototype.hasOwnProperty.call(b, k) &&
            equal_value(a[k], b[k])
        )
}

const compare_arrays_value = (a, b) =>
    a.length === b.length &&
    a.every((v, i) => equal_value(v, b[i]))

const equal_value = (a, b) => {
    if (a !== b) {
        const type = typeof a
        if (type !== typeof b)
            return false
        else if (type === 'object') {
            if (Array.isArray(a) && Array.isArray(b)) {
                return compare_arrays_value(a, b)
            }
            else return a !== null &&
                b !== null &&
                compare_objects_value(a, b)
        }
        else return (type === 'function' && ('' + a === '' + b))
    } else return true
}

const equal_hint_argument = () => {
    throw new ValidationError(`equal(?,?) missing or undefined argument(s).
        You can test for an undefined x via : equal.undefined(x)
        ~ Or did you intend to use : check([...propositions,] function => boolean) ?`)
}

const equal = (a = equal_hint_argument(), b = equal_hint_argument()) => {
    if (!equal_value(a, b)) {
        throw_unequal(a, b)
    }
    return true
}

equal.undefined = u => (typeof u === 'undefined')
    ? true
    : (() => { throw new ValidationError(`Evaluation equal.undefined -> ${typeof u} [${quote_wrap(u)}]`) })()

const { flatn, is_plain_object } = require('./object')

const print_table_diff = (a, b) => {
    const has = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
    const l_flat = flatn(a)
    const r_flat = flatn(b)
    const l_keys = Object.entries(l_flat).filter(([k, v]) => !equal_value(v, r_flat[k])).map(([k]) => k)
    const r_keys = Object.entries(r_flat).filter(([k, v]) => !equal_value(v, l_flat[k])).map(([k]) => k)
    const diff_keys = [...new Set(l_keys.concat(r_keys))]
    const printable = (v) => typeof v === 'function' ? `Function: ${v + ''}` : v
    const left = diff_keys.reduce((acc, p) => {
        const compare = {}
        if (has(l_flat, p))
            compare.lhs = printable(l_flat[p])
        if (has(r_flat, p))
            compare.rhs = printable(r_flat[p])
        acc[p] = compare
        return acc
    }, {})
    console.log('-'.repeat(50))
    console.log('equal(lhs, ..)', a)
    console.log('-'.repeat(50))
    console.log('equal(.. , rhs)', b)
    console.log('-'.repeat(50))
    console.table(left)
}

const throw_unequal = (a, b) => {
    const type_diff = (typeof a !== typeof b)
        ? `\n\t-> Type mismatch: equal(${typeof a}, ${typeof b}).` : ''

    // Todo if plain objects, short Validation message: ('equal(object, object)')
    // instead of Evaluation[lots of unreadable json data] === [lots of unreadable json]
    const e = new ValidationError(`Evaluation [${quote_wrap(a)}] === [${quote_wrap(b)}]${type_diff}`)

    if (is_plain_object(a) && is_plain_object(b)) {
        e.display = () => {
            print_table_diff(a, b)
        }
    }
    throw e
}

module.exports = {
    test,
    throws,
    equal,
    check
}
