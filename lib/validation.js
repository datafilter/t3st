class ValidationError extends Error {
    constructor(cause) {
        super(cause)
        this.cause = cause
    }
    display() { }
}

const ok_result = (description) => ({ description })

const error_result = (description, error, origin) =>
    ({
        description,
        has_error: true,
        error,
        trace: error_origin(error, origin),
        has_validation_error: error instanceof ValidationError
    })

const error_origin = (error, origin = []) => {

    const err = error && error.stack ? error : new Error()

    const stack = err instanceof ValidationError ?
        err.stack.replace(err.cause, '') : err.stack

    const err_stack = stack.split('\n').slice(1)
    // TODO test behaviour if non-standard Error.prototype.stack is undefined

    const path = require('path')
    const path_lib = path.join('t3st', 'lib')
    const path_bin = path.join('t3st', 'bin')

    const more_helpful_frames = (frames) => frames
        .filter(src => !src.includes(path_lib))
        .filter(src => !src.includes(path_bin))
        .filter(src => !src.includes('at processTicksAndRejections'))
        .filter(src => !src.includes('at async Promise.all (index '))
        .join("\n\t")

    const helpful_error = more_helpful_frames(err_stack)

    const helpful_origin = more_helpful_frames(origin)

    return helpful_error || helpful_origin ||
        `Unknown error origin.\n\t > Possible missing 'await' statement before an async test:\n\t > await test(.., async () => {..})`
}

const invalid_body = (additional_error = '') => {
    throw new ValidationError(additional_error + 'invalid test !! expected test(string, { function OR async function (not promise) })')
}

const test_invalid_body = (description, body) =>
    test_now(description, () =>
        invalid_body(`unexpected body type in test(string, ${typeof body})\n\t--> `))

const test = (description = 'empty test', body = invalid_body) => {
    return (typeof body !== 'function')
        ? test_invalid_body(description, body)
        : test_function(description, body)
}

const test_function = (description, func) => {
    switch (func.constructor.name) {
        case 'Function':
            return test_now(description, func)
        case 'AsyncFunction': {
            const initial_stack = Error().stack
            return test_async(description, func, initial_stack)
        }
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

const test_async = async (description, async_func, stack) => {
    try {
        await async_func()
        return ok_result(description)
    } catch (err) {

        const pre_run = stack.split('\n').slice(1)
            .reduce((acc, frame) => {
                const { skip, frames } = acc
                if (skip || frame.includes('at test_file') && frame.includes('run.js')) {
                    return { skip: true, frames }
                }
                else return { skip, frames: [...frames, frame] }
            }, ({ skip: false, frames: [] }))

        return error_result(description, err, pre_run.frames)
    }
}

const missing_function = Symbol()
const throw_missing = () => { throw missing_function }

const expect_error = (f, description = 'description') => {
    const not_thrown = Symbol()
    try {
        f()
        throw not_thrown
    } catch (err) {
        if (err === not_thrown) {
            throw new ValidationError("did not throw expected error")
        } else if (err === missing_function) {
            throw new ValidationError(`expected throws(\`${description}\`, () => { ..code })`)
        }
        else return err
    }
}

const throws = (description, f = throw_missing, maybe_check = id => id) => {
    if (f === throw_missing && typeof description === 'function') {
        return expect_error(description)
    }
    const test_name = description === '' || typeof description === 'undefined'
        ? 'throws() is empty' : description
    return test(test_name, () => {
        const err = expect_error(f, description)
        maybe_check(err)
    })
}

const quote_wrap = (value) => typeof value === 'string' || typeof value === 'function'
    ? `'${value}'` : JSON.stringify(value, null, 2)

const evaluate = (assumption, propositions) => {
    const tA = typeof assumption
    const validate = tA === 'function'
        ? () => assumption(...propositions)
        : tA === 'boolean'
            ? () => assumption === true && propositions.every(p => p === true)
            : (() => {
                throw new ValidationError(`check doesn't support (...args, ${typeof assumption}).` +
                    `\nCheck last argument must be either function or boolean.`)
            })()
    try {
        const ok = validate()
        if (typeof ok === 'boolean') {
            return ok ? '' : 'check invalid'
        } else return '!! expected check(function => boolean), not check(function => truthy)'
    } catch (err) {
        return `!! check failed *before* assertion\n\t--> !! ${err}`
    }
}

// todo merge with evaluate function, then move to separate file, then clean up.
const check = (...factors) => {
    if (factors.length === 0)
        throw new ValidationError('check expected (...values [, function => boolean])')
    const [assumption, ...reversed_propositions] = factors.reverse()
    const propositions = reversed_propositions.reverse()

    const error_message = evaluate(assumption, propositions)

    if (error_message) {
        const tA = typeof assumption
        const fail_reason = tA === 'function'
            ? 'function evaluated to false'
            : tA === 'boolean'
                ? 'some argument(s) !== true'
                : ''
        const args = factors.reverse().map((f, i) => `arg[${i}]: ${quote_wrap(f)}`)
        const msg = args.reduce((xs, s) => `${xs}\n\t${s}`,
            `${error_message} with ${factors.length} argument(s):\n\t-> ${fail_reason}`)
        throw new ValidationError(msg)
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

    const e = new ValidationError(`Evaluation [${quote_wrap(a)}] === [${quote_wrap(b)}]${type_diff}`)

    if (is_plain_object(a) && is_plain_object(b)) {
        e.display = () => {
            print_table_diff(a, b)
        }
        e.message = "objects did not match: equal(lhs, rhs)"
    }
    throw e
}

module.exports = {
    test,
    throws,
    equal,
    check
}
