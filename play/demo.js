module.exports = async ({ test, assert, affirm, alike }) => [

    // Hello World
    test("passing in a function runs it", () => console.log('spooky side-effect'))

    // Fun Validation
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

    // Pinky Promise 
    , await test("tests can be async", async () => {
        const james = await Promise.resolve('bond')
        assert(james, 'bond')
    })

    // It can handle nesting test results
    , [[[[test("results can be a little bit nested", () => { }),
    [[test("so don't worry about flattening them", () => { })]]]]]]
]