module.exports = ({ test, throws, equal, affirm }) => {

    const affirm_tests = [
        test("true equal returns true", () =>
            equal(true, affirm(() => true))
        )
        , throws("on false evaluation with evaluation", () => {
            affirm(() => 1 === 7)
        }, err => {
            equal(true, err.message.includes('() => 1 === 7'))
        })
        , test("affirm nothing gives hint", async () => {
            const nullary_affirm = await test("_", () => affirm())
            equal(true, nullary_affirm.error.message.includes('expected (...values, function => boolean'))
        })
        , test("includes error message of invalid assertion", async () => {
            /* eslint-disable no-undef */
            const err_false = await test("_", () => affirm(() => _undefined))
            /* eslint-enable no-undef */
            affirm(err_false.error.message, (m) => m.includes("ReferenceError: _undefined is not defined"))
            affirm(err_false.error.message, (m) => m.includes("failed *before* assertion"))
        })
        , test("test catches error in affirm proposition arguments", async () => {
            /* eslint-disable no-undef */
            const err_false = await test("_", () => affirm(_undefined, (_n, _a) => true))
            /* eslint-enable no-undef */
            affirm(err_false.error + '', (err) => err.includes("ReferenceError: _undefined is not defined"))

            affirm(err_false.error + '', (err) => false === err.includes("failed *before* assertion"))
        })
        , throws("expects a boolean result", () => {
            affirm(() => 'truthy')
        }, (err) => {
            affirm(err.message, (m) => m.includes('expected affirm(function => boolean)'))
            equal(false, err.message.includes("failed *before* assertion"))
        })
        , test("ok equal truthy with !!", () => affirm(() => !!'truthy'))
        , test("includes evaluation in false assertion", async () => {
            const err_false = await test("_", () => affirm(() => 50 < 1))
            equal(true, err_false.error.message.includes("Evaluation [() => 50 < 1]"))

            equal(false, err_false.error.message.includes("failed *before* assertion"))
        })
        , test("description is optional", () => affirm(() => true))
        , test("description can be added", () => affirm("something", () => true))
        , test("description is shown in error message", async () => {
            const flavor = "cinnamon"
            const err_description = await test("_", () => affirm(flavor, () => flavor == "vanilla"))
            equal(true, err_description.error.message.includes("cinnamon"))
            equal(true, err_description.error.message.includes(`Evaluation [() => flavor == "vanilla"]`))
        })
        , test("propositions are passed into assertion", () => {
            const one = 1
            const two = 2
            affirm(one, two, (x, y) => x === 1 && x + y === 3)
        })
        , test("invalid assertion shows each preposition value with strings quoted", async () => {
            const text = "water"
            const number = 7
            const false_affirm = await test("_", () => affirm(text, number, {}, 'na', (_na) => false))
            const m = false_affirm.error.message
            equal(true, m.includes('water'))
            equal(true, m.includes(`'water'`))
            equal(true, m.includes('7'))

            equal(false, m.includes(`'7'`))
        })
        , test("affirm error includes preposition object properties", async () => {
            const test_object = {
                name: 'mark',
                cars: [{ year: 1976 }, {}]
            }
            const false_affirm = await test("_", () => affirm(test_object, () => false))

            affirm(false_affirm.error.message, (m) =>
                m.includes('mark') &&
                m.includes(1976) &&
                m.includes(JSON.stringify({})))
        })

    ]

    return affirm_tests
}
