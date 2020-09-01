module.exports = ({ test, equal, affirm }) => [
    test("Equal quotes string in error", () => {
        affirm(test('', () =>
            equal(true, 'true')).error.message,
            (m) => m.includes(`[true] === ['true']`))
        affirm(test('', () =>
            equal(0, '0')).error.message,
            (m) => m.includes(`[0] === ['0']`))
    })
    , test("equal quotes string in error", () => {
        affirm(test('', () =>
            equal(true, 'true')).error.message,
            (m) => m.includes(`[true] === ['true']`))
        affirm(test('', () =>
            equal(0, '0')).error.message,
            (m) => m.includes(`[0] === ['0']`))
    })
    , test("Affirm quotes string in error", () => {
        affirm(test('', () =>
            affirm(true, 'true', false)).error.message,
            (m) => m.includes('--> true\n') && m.includes(`--> 'true'\n`))
        affirm(test('', () =>
            affirm(0, '0', false)).error.message,
            (m) => m.includes('--> 0\n') && m.includes(`--> '0'\n`))
    })
]
