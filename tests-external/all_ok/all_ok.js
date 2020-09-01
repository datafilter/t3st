module.exports = ({ test, equal, affirm }) => [
    test("ok", () => true),
    test("also ok", () => { equal(1, 1) }),
    test("also ok", () => { affirm(1, (uno) => uno === 1) }),
    test("also ok", () => { equal({ a: 1, b: 2 }, { b: 2, a: 1 }) })
]