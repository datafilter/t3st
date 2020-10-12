module.exports = ({ test, throws, equal, check }) => {

    const check_tests = [
        test("true equal returns true", () =>
            equal(true, check(() => true))
        )
        , throws("on false evaluation with evaluation", () => {
            check(() => 1 === 7)
        }, err => {
            equal(true, err.message.includes('() => 1 === 7'))
        })
        , test("check nothing gives hint", async () => {
            const nullary_check = await test("_", () => check())
            equal(true, nullary_check.error.message.includes('expected (...values, function => boolean'))
        })
        , test("includes error message of invalid assertion", async () => {
            /* eslint-disable no-undef */
            const err_false = await test("_", () => check(() => _undefined))
            /* eslint-enable no-undef */
            check(err_false.error.message, (m) => m.includes("ReferenceError: _undefined is not defined"))
            check(err_false.error.message, (m) => m.includes("failed *before* assertion"))
        })
        , test("test catches error in check proposition arguments", async () => {
            /* eslint-disable no-undef */
            const err_false = await test("_", () => check(_undefined, (_n, _a) => true))
            /* eslint-enable no-undef */
            check(err_false.error + '', (err) => err.includes("ReferenceError: _undefined is not defined"))

            check(err_false.error + '', (err) => false === err.includes("failed *before* assertion"))
        })
        , throws("expects a boolean result", () => {
            check(() => 'truthy')
        }, (err) => {
            check(err.message, (m) => m.includes('expected check(function => boolean)'))
            equal(false, err.message.includes("failed *before* assertion"))
        })
        , test("ok equal truthy with !!", () => check(() => !!'truthy'))
        , test("includes evaluation in false assertion", async () => {
            const err_false = await test("_", () => check(() => 50 < 1))
            equal(true, err_false.error.message.includes("Evaluation [() => 50 < 1]"))

            equal(false, err_false.error.message.includes("failed *before* assertion"))
        })
        , test("description is optional", () => check(() => true))
        , test("description can be added", () => check("something", () => true))
        , test("description is shown in error message", async () => {
            const flavor = "cinnamon"
            const err_description = await test("_", () => check(flavor, () => flavor == "vanilla"))
            equal(true, err_description.error.message.includes("cinnamon"))
            equal(true, err_description.error.message.includes(`Evaluation [() => flavor == "vanilla"]`))
        })
        , test("propositions are passed into assertion", () => {
            const one = 1
            const two = 2
            check(one, two, (x, y) => x === 1 && x + y === 3)
        })
        , test("invalid assertion shows each preposition value with strings quoted", async () => {
            const text = "water"
            const number = 7
            const false_check = await test("_", () => check(text, number, {}, 'na', (_na) => false))
            const m = false_check.error.message
            equal(true, m.includes('water'))
            equal(true, m.includes(`'water'`))
            equal(true, m.includes('7'))

            equal(false, m.includes(`'7'`))
        })
        , test("check error includes preposition object properties", async () => {
            const test_object = {
                name: 'mark',
                cars: [{ year: 1976 }, {}]
            }
            const false_check = await test("_", () => check(test_object, () => false))

            check(false_check.error.message, (m) =>
                m.includes('mark') &&
                m.includes(1976) &&
                m.includes(JSON.stringify({})))
        })

    ]

    return check_tests
}
