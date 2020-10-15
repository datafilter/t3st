module.exports = async ({ test, equal, check, throws }) => [

    // Hello World
    test("passing in a function runs it", () => console.log('spooky side-effect'))

    // Fun Validation
    , test("equal compares values with ===", () => {
        const five = 2 + 3
        equal(5, five)
    })
    , test("remove comments to view detailed output using check", () => {
        const a = 'some' //+ ' thing'
        const b = 5 //+ 1
        const c = { name: 'mark' }
        check(a, b, c.name.length, (text, number, name_length) => {
            return number == 5 && text.length >= name_length
        })
    })
    , test("compare data transfer objects with equal", () => {
        const a = { 'type': 'aircraft', 'cost': '$4bn' }
        const b = { 'type': 'aircraft', 'cost': '$4bn' }
        equal(a, b)
    })
    , throws("expects erros to be thrown", () => {
        throw 'uncomment this line to cause failing test'
    })
    // todo after merge test & test async functions.
    // , await throws("expects erros to be thrown", async () => {
    //     const reject = Promise.reject()
    //     await reject
    // })

    // Pinky Promise 
    , await test("tests can be async", async () => {
        const james = await Promise.resolve('bond')
        equal(james, 'bond')
    })

    // It can handle nesting test results
    , [[[[test("results can be a little bit nested", () => { }),
    [[test("so don't worry about flattening them", () => { })]]]]]]
]