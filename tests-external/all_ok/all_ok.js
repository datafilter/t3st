/* eslint-disable no-sparse-arrays */
module.exports = ({ test, equal, check }) => [
    test("ok", () => true),
    test("also ok", () => { equal(1, 1) }),
    test("also ok", () => { check(1, (uno) => uno === 1) }),
    /* additional undefined and undefined sub values */
    , , , [, , [, ,]], ,
    test("also ok", () => { equal({ a: 1, b: 2 }, { b: 2, a: 1 }) })
]