const is_plain_object = (obj) =>
    obj !== null &&
    typeof obj === 'object' &&
    !Array.isArray(obj)

const flatn = (obj, flat = Object.create(null), name) => {
    const props =
        is_plain_object(obj)
        && Object.entries(obj)

    return (props.length) ?
        props.reduce((acc, [k, v]) => ({
            ...flatn(v, flat, name ? `${name}.${k}` : k)
            , ...acc
        }), flat)
        : name ? { [name]: obj, ...flat } : obj
}

module.exports = {
    is_plain_object,
    flatn
}