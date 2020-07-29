module.exports = async ({ test, assert, affirm, alike }) => [

    // Hello World
    test("can be a simple boolean expression", 1 > 0)
    , test("doesn't print to console, it just returns a result", !!`truthy made boolean with !!`)

    // Fun Validation
    , test("passing in a function runs it", () => console.log('spooky side-effect'))
    , test("assert compares values with ===", () => {
        const five = 2 + 3
        assert(5, five)
    })
    , test("remove comments to view detailed output using affirm", () => {
        const a = 'some' //+ ' thing'
        const b = 5 //+ 1
        const c = { name: 'mark' }
        affirm(a, b, c.name.length, (text, number, name_length) => {
            return number == 5 && text.length >= name_length
        })
    })
    , test("compare data transfer objects with alike", () => {
        const a = { 'type': 'aircraft', 'cost': '$4bn' }
        const b = { 'type': 'aircraft', 'cost': '$4bn' }
        alike(a, b)
    })
    , test("assert and affirm return boolean ~ so you can chain them with &&",
        assert(true, true) && assert('ab', 'a' + 'b') && affirm(0, (zero, _ignored) => zero === 0))

    // Pinky Promise 
    , await test("tests can be async", async () => {
        const james = await Promise.resolve('bond')
        assert(james, 'bond')
    })
    , await test("You can use a promise chaining instead of await",
        Promise.resolve(1).then(x => x === 1))

    // It can handle nesting test results
    , [[[[test("results can be a little bit nested", true),
    [[test("so don't worry about flattening them", true)]]]]]]
]