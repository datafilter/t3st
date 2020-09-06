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

const expect_error = (f) => {
    const not_thrown = {}
    try {
        f()
        throw not_thrown
    } catch (err) {
        if (err === not_thrown)
            throw Error("did not throw expected error")
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
    try {
        const ok = assumption(...propositions)
        if (typeof ok === 'boolean') {
            return ok ? '' : '!! false assertion'
        } else return '!! expected affirm(function => boolean), not affirm(function => truthy)'
    } catch (err) {
        return `!! affirm failed *before* assertion\n\t--> !! ${err}`
    }
}

// TODO (also in equal): Highlight first difference with ^^^ in error output
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

const flatn = (obj, flat = Object.create(null), name) => {
    const props =
        typeof obj === 'object'
        && obj !== null
        && !Array.isArray(obj)
        && Object.entries(obj)

    return (props.length) ?
        props.reduce((acc, [k, v]) => ({
            ...flatn(v, flat, name ? `${name}.${k}` : k)
            , ...acc
        }), flat)
        : name ? { [name]: obj, ...flat } : obj
}

// todo invert equal_bool with equal (so neither try/catches)
const equal_bool = (a, b) => {
    try {
        return equal(a, b)
    } catch (err) {
        return false
    }
}

const print_table_diff = (a, b) => {
    const has = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
    const l_flat = flatn(a)
    const r_flat = flatn(b)
    const l_keys = Object.entries(l_flat).filter(([k, v]) => !equal_bool(v, r_flat[k])).map(([k]) => k)
    const r_keys = Object.entries(r_flat).filter(([k, v]) => !equal_bool(v, l_flat[k])).map(([k]) => k)
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

//todo return symbol checked by test instead.
const throw_unequal = (a, b) => {
    const e = Error(`Evaluation [${quote_wrap(a)}] === [${quote_wrap(b)}]`)
    if (a !== null && b !== null &&
        typeof a === 'object' && typeof b === 'object' &&
        !Array.isArray(a) && !Array.isArray(b)) {
        e.display = () => {
            print_table_diff(a, b)
        }
    }
    throw e
}

const compare_objects = (a, b) => {
    const kA = Object.keys(a)
    if (kA.length !== Object.keys(b).length)
        throw_unequal(a, b)
    try {
        kA.every((k) => {
            if (!Object.prototype.hasOwnProperty.call(b, k))
                throw_unequal(a, b)
            equal(a[k], b[k])
        })
    } catch (err) {
        throw_unequal(a, b)
    }
}

const compare_arrays = (a, b) =>
    a.length === b.length &&
    a.every((v, i) => equal(v, b[i])) || throw_unequal(a, b)

const equal_hint_argument = () => {
    throw Error(`equal(?,?) missing or undefined argument(s).
        You can test for an undefined x via : equal.undefined(x)
        ~ Or did you intend to use : affirm([...propositions,] function => boolean) ?`)
}

const equal = (a = equal_hint_argument(), b = equal_hint_argument()) => {
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
            if (a === null || b === null)
                throw_unequal(a, b)
            return compare_objects(a, b)
        }
        if (tA === 'function' && ('' + a === '' + b)) {
            return true
        }
        else throw_unequal(a, b)
    } else return true
}

equal.undefined = u => (typeof u === 'undefined')
    ? true
    : (() => { throw Error(`Evaluation equal.undefined -> ${typeof u} [${quote_wrap(u)}]`) })()

module.exports = {
    test,
    throws,
    equal,
    affirm
}
