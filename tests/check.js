module.exports = ({ test, throws, equal, check }) => {

    const check_tests = [
        test("true equal returns true", () => {
            equal(true, check(true))
            equal(true, check(() => true))
        })
        , throws("on false evaluation with evaluation", () => {
            check(() => 1 === 7)
        }, err => {
            equal(true, err.message.includes('() => 1 === 7'))
        })
        , throws("on false evaluation with boolean", () => {
            check(true, true, false)
        })
        , throws("error for non boolean argument", () => {
            check(1)
        }, err => {
            equal(true, err.message.includes('argument must be either function or boolean'))
        })
        , test("function check can have non boolean arguments", () => {
            check(1, '2', (a, b) => a + Number(b) === 3)
        })
        , throws("check nothing gives hint", () => {
            check()
        }, (err) => {
            equal(true, err.message.includes('expected (...values [, function => boolean]'))
        })
        , throws("includes error message of invalid assertion", () => {
            check(() => _undefined)
        }, (err) => {
            check(err.message, (m) => m.includes("ReferenceError: _undefined is not defined"))
            check(err.message, (m) => m.includes("failed *before* assertion"))
        })
        , throws("test catches error in check proposition arguments", () => {
            check(_undefined, (_n, _a) => true)
        }, (err) => {
            check(err + '', (err) => err.includes("ReferenceError: _undefined is not defined"))
            check(err + '', (err) => false === err.includes("failed *before* assertion"))
        })
        , throws("expects a boolean result", () => {
            check(() => 'truthy')
        }, (err) => {
            check(err.message, (m) => m.includes('expected check(function => boolean)'))
            equal(false, err.message.includes("failed *before* assertion"))
        })
        , test("ok equal truthy with !!", () => check(() => !!'truthy'))
        , throws("includes evaluation in false assertion", () => {
            check(() => 50 < 1)
        }, (err) => {
            equal(true, err.message.includes("() => 50 < 1"))
            equal(false, err.message.includes("failed *before* assertion"))
        })
        , test("description is optional", () => check(() => true))
        , test("description can be added", () => check("something", () => true))
        , throws("description is shown in error message", () => {
            const flavor = "cinnamon"
            check(flavor, () => flavor == "vanilla")
        }, (err) => {
            equal(true, err.message.includes("cinnamon"))
            equal(true, err.message.includes(`() => flavor == "vanilla"`))
        })
        , test("propositions are passed into assertion", () => {
            const one = 1
            const two = 2
            check(one, two, (x, y) => x === 1 && x + y === 3)
        })
        , throws("invalid assertion shows each preposition value with strings quoted", () => {
            const text = "water"
            const number = 7
            check(text, number, {}, 'na', (_na) => false)
        }, (err) => {
            const m = err.message
            equal(true, m.includes('water'))
            equal(true, m.includes(`'water'`))
            equal(true, m.includes('7'))

            equal(false, m.includes(`'7'`))
        })
        , throws("check error includes preposition object properties", () => {
            const test_object = {
                name: 'mark',
                cars: [{ year: 1976 }, {}]
            }
            check(test_object, () => false)
        }, (err) => {
            check(err.message, (m) =>
                m.includes('mark') &&
                m.includes(1976) &&
                m.includes(JSON.stringify({}, null, 2)))
        })

    ]

    return check_tests
}
