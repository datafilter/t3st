module.exports = ({ test, assert, affirm, alike }) => [
    test("Assert quotes string in error", () => {
        affirm(test('', () =>
            assert(true, 'true')).error,
            (e) => e.includes(`[true] === ['true']`))
        affirm(test('', () =>
            assert(0, '0')).error,
            (e) => e.includes(`[0] === ['0']`))
    })
    , test("Alike quotes string in error", () => {
        affirm(test('', () =>
            alike(true, 'true')).error,
            (e) => e.includes(`[true] === ['true']`))
        affirm(test('', () =>
            alike(0, '0')).error,
            (e) => e.includes(`[0] === ['0']`))
    })
    , test("Affirm quotes string in error", () => {
        affirm(test('', () =>
            affirm(true, 'true', false)).error,
            (e) => e.includes('--> true\n') && e.includes(`--> 'true'\n`))
        affirm(test('', () =>
            affirm(0, '0', false)).error,
            (e) => e.includes('--> 0\n') && e.includes(`--> '0'\n`))
    })
]
