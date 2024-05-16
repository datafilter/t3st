module.exports = async ({ test }) => [
    await test("unhandled promise rejection", async () => {
        const _r = Promise.reject('unobserved')
    })
]