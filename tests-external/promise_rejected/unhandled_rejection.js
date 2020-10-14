module.exports = async ({ test }) => [
    await test("unhandled promise rejection", async () => {
        // node --unhandled-rejections=strict
        const r = Promise.reject('unobserved')
    })
]