module.exports = ({ test, assert, affirm }) => {

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
            affirm(err_third.error.message, (m) => m.includes('Evaluation [() => 1 === 5]'))
        })
    ]

    const affirm_tests = [
        test("affirm nothing gives hint", () => {
            const nullary_affirm = test("_", () => affirm())
            assert(true, nullary_affirm.error.message.includes('expected (...values, function => boolean'))
        })
        , test("includes error message of invalid assertion", () => {
            const err_false = test("_", () => affirm(() => mark))
            affirm(err_false.error.message, (m) => m.includes("ReferenceError: mark is not defined"))
            affirm(err_false.error.message, (m) => m.includes("failed *before* assertion"))
        })
        , test("test catches error in affirm proposition arguments", () => {
            const err_false = test("_", () => affirm(mark, (_n, _a) => true))
            affirm(err_false.error + '', (err) => err.includes("ReferenceError: mark is not defined"))

            affirm(err_false.error + '', (err) => false === err.includes("failed *before* assertion"))
        })
        , test("expects a boolean result", () => {
            const non_boolean = test("_", () => affirm(() => 'truthy'))
            assert(true, !!non_boolean.trace)
            affirm(non_boolean.error.message, (m) =>
                m.includes('expected affirm(function => boolean)'))

            assert(false, non_boolean.error.message.includes("failed *before* assertion"))
        })
        , test("ok assert truthy with !!", () => affirm(() => !!'truthy'))
        , test("includes evaluation in false assertion", () => {
            const err_false = test("_", () => affirm(() => 50 < 1))
            assert(true, err_false.error.message.includes("Evaluation [() => 50 < 1]"))

            assert(false, err_false.error.message.includes("failed *before* assertion"))
        })
        , test("description is optional", () => affirm(() => true))
        , test("description can be added", () => affirm("something", () => true))
        , test("description is shown in error message", () => {
            const flavor = "cinnamon"
            const err_description = test("_", () => affirm(flavor, () => flavor == "vanilla"))
            assert(true, err_description.error.message.includes("cinnamon"))
            assert(true, err_description.error.message.includes(`Evaluation [() => flavor == "vanilla"]`))
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
            const m = false_affirm.error.message
            assert(true, m.includes('water'))
            assert(true, m.includes(`'water'`))
            assert(true, m.includes('7'))

            assert(false, m.includes(`'7'`))
        })
        , test("affirm error includes preposition object properties", () => {
            const test_object = {
                name: 'mark',
                cars: [{ year: 1976 }, {}]
            }
            const false_affirm = test("_", () => affirm(test_object, () => false))

            affirm(false_affirm.error.message, (m) =>
                m.includes('mark') &&
                m.includes(1976) &&
                m.includes(JSON.stringify({})))
        })
    ]

    return [affirm_chain_tests, affirm_tests]
}
