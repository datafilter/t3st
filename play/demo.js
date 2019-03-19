module.exports = async ({ test, assert, affirm }) => {

    const hello_world = [
        test("can be a simple boolean expression", 1 > 0)
        , test("doesn't print to console, it just returns a result", !!`truthy made boolean with !!`)
    ]

    const hello_function = [
        test("passing in a function runs it", () => console.log('spooky side-effect'))
        , test("assert compares values with ===", () => {
            const five = 2 + 3
            assert(5, five)
        })
        , test("remove comments to view detailed output using affirm", () => {
            const a = 'some' //+ '?'
            const b = 5 //+ 1
            const c = { name: 'mark' }
            affirm(a, b, c.name.length, (text, number, name_length) => {
                return number == 5 && text.length >= name_length
            })
        })
        , test("assert and affirm return boolean ~ so you can chain them with &&",
            assert(true, true) && assert('ab', 'a' + 'b') && affirm(0, (zero, _ignored) => zero === 0))
    ]

    return [...hello_world, ...hello_function]
}