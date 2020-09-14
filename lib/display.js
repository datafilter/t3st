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

module.exports = {
    flatn,
    print_table_diff
}