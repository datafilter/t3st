
const fs = require('fs')
const path = require('path')

const usage = `Required name.
Usage: npx t3st gen <test filename>
       npx t3st gen --ref <target filename>

       Without --ref option, only a test file is created, in the /tests directory.
       With the --ref option, a file, and a test file is created.
       
       If the filename has no extension it is appended with .js
`

const source_test = `module.exports = async ({ test, assert, affirm, alike }) => {

    <<replace>>

    return [
        test("description", () => {
            assert(2, 1 + 1)
            affirm(1, 1 + 1, (a, b) => a + b == 3)
        }),
        , await test("async test as to be awaited.", async () => {
            alike({}, {})
        })]
}`

const source_new = `module.exports = () => true`

module.exports = (display, filename, is_ref = false) => {

    if (!filename) {
        display.log(usage)
        process.exitCode = 1
        return
    }

    const filename_with_ext = filename.includes('.') ? filename : filename + '.js'
    // regex: remove leading / and \ slashes
    const file_path = path.normalize(filename_with_ext).replace(/^\/+/g, '').replace(/^\\+/g, '') 

    const test_path = path.join(`tests`, file_path)

    const create_file = (file, contents) => {
        if (fs.existsSync(file)) {
            display.log(`File ${file} already exists.`)
        } else {
            fs.writeFileSync(file, contents)
            display.log(`Created ${file}.`)
        }
    }

    const require_path = (file_path.includes('/') || file_path.includes('\\'))
        ? path.join('../', file_path).replace(/\\/g, '/')
        : path.join('../', file_path).replace(/\\/g, '/')

    console.log('req path:', require_path)

    const test_content = is_ref
        ? source_test.replace(`<<replace>>`,
            `const ${
            path.basename(file_path, path.extname(file_path))
            } = require.main.require('${
            require_path
            }')`)
        : source_test.replace(`<<replace>>`, `// const unit = require('...')`)

    fs.mkdirSync(path.dirname(test_path), { recursive: true });
    create_file(test_path, test_content)

    if (is_ref) {
        fs.mkdirSync(path.dirname(file_path), { recursive: true });
        create_file(file_path, source_new)
    }

    // todo external tests.
    // delete with:
    // fs.unlinkSync(test_path)
    // if (is_ref) { fs.unlinkSync(file_path) }

}