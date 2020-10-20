const run_tests = ({ test, equal }) => [
    test("Javascript module supported.", () => equal(1 + 1, 2))
]

export default run_tests