module.exports = ({ test, equal, check }) => [
    test("Equal quotes string in error", () => {
        check(test('', () =>
            equal(true, 'true')).error.message,
            (m) => m.includes(`[true] === ['true']`))
        check(test('', () =>
            equal(0, '0')).error.message,
            (m) => m.includes(`[0] === ['0']`))
    })
    , test("equal quotes string in error", () => {
        check(test('', () =>
            equal(true, 'true')).error.message,
            (m) => m.includes(`[true] === ['true']`))
        check(test('', () =>
            equal(0, '0')).error.message,
            (m) => m.includes(`[0] === ['0']`))
    })
    , test("check quotes string in error", () => {
        check(test('', () =>
            check(true, 'true', false)).error.message,
            (m) => m.includes('--> true\n') && m.includes(`--> 'true'\n`))
        check(test('', () =>
            check(0, '0', false)).error.message,
            (m) => m.includes('--> 0\n') && m.includes(`--> '0'\n`))
    })
]
