module.exports = ({ test, assert, affirm, alike }) => [
    test("Assert quotes string in error", () => {
        affirm(test('', () =>
            assert(true, 'true')).error.message,
            (m) => m.includes(`[true] === ['true']`))
        affirm(test('', () =>
            assert(0, '0')).error.message,
            (m) => m.includes(`[0] === ['0']`))
    })
    , test("Alike quotes string in error", () => {
        affirm(test('', () =>
            alike(true, 'true')).error.message,
            (m) => m.includes(`[true] === ['true']`))
        affirm(test('', () =>
            alike(0, '0')).error.message,
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
