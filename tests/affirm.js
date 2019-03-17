module.exports = (framework) => {

    const { test, assert, affirm } = framework

    const affirm_chain_tests = [
        test("true assert returns true", () =>
            assert(true, affirm(() => true))
        )
        , test("chained assert stops at first error", () => {
            const err_third = test("_", () =>
                affirm(() => true)
                && affirm(() => 1 === 1)
                && affirm(() => 1 === 5)
                && affirm(() => 6 === 7)
            )
            assert(true, err_third.error.includes('Evaluation [() => 1 === 5]'))
        })
    ]

    const affirm_tests = [
        test("affirm nothing gives hint", () => {
            const nullary_affirm = test("_", () => affirm())
            assert(true, nullary_affirm.error.includes('expected (...values, function => boolean'))
        })
        , test("includes error message of invalid assertion", () => {
            const err_false = test("_", () => affirm(() => mark))
            assert(true, err_false.error.includes("ReferenceError: mark is not defined"))

            assert(true, err_false.error.includes("failed *before* assertion"))
        })
        , test("test catches error in affirm proposition arguments", () => {
            const err_false = test("_", () => affirm(mark, (_n, _a) => true))
            affirm(err_false.error + '', (err) => err.includes("ReferenceError: mark is not defined"))

            affirm(err_false.error + '', (err) => false === err.includes("failed *before* assertion"))
        })
        , test("expects a boolean result", () => {
            const non_boolean = test("_", () => affirm(() => 'truthy'))
            assert(true, !!non_boolean.error)
            affirm(non_boolean.error, () =>
                non_boolean.error.includes('expected affirm(function => boolean)'))

            assert(false, non_boolean.error.includes("failed *before* assertion"))
        })
        , test("ok assert truthy with !!", () => affirm(() => !!'truthy'))
        , test("includes evaluation in false assertion", () => {
            const err_false = test("_", () => affirm(() => 50 < 1))
            assert(true, err_false.error.includes("Evaluation [() => 50 < 1]"))

            assert(false, err_false.error.includes("failed *before* assertion"))
        })
        , test("description is optional", () => affirm(() => true))
        , test("description can be added", () => affirm("something", () => true))
        , test("description is shown in error message", () => {
            const flavor = "cinnamon"
            const err_description = test("_", () => affirm(flavor, () => flavor == "vanilla"))
            assert(true, err_description.error.includes("cinnamon"))
            assert(true, err_description.error.includes(`Evaluation [() => flavor == "vanilla"]`))
        })
        , test("propositions are passed into assertion", () => {
            const one = 1
            const two = 2
            affirm(one, two, (x, y) => x === 1 && x + y === 3)
        })
        , test("invalid assertion shows each preposition value with strings quoted", () => {
            const text = "water"
            const number = 7
            const false_affirm = test("_", () => affirm(text, number, {}, 'na', (_na) => false))
            assert(true, false_affirm.error.includes('water'))
            assert(true, false_affirm.error.includes(`'water'`))
            assert(true, false_affirm.error.includes('7'))

            assert(false, false_affirm.error.includes(`'7'`))
        })
    ]

    return [affirm_chain_tests, affirm_tests]
}
