module.exports = async ({ test }) => [
    test("async test without await", async () => {
        throw null
    })
]