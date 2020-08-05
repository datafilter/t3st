module.exports = ({ test, assert, affirm, alike }) => [
    test("ok", () => true),
    test("also ok", () => { assert(1, 1) }),
    test("also ok", () => { affirm(1, (uno) => uno === 1) }),
    test("also ok", () => { alike({ a: 1, b: 2 }, { b: 2, a: 1 }) })
]