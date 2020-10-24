import { readFileSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

export const jsmodule = (test_url_or_path, module_path) => {

    const __filename = test_url_or_path.toLowerCase().startsWith('file:')
        ? fileURLToPath(test_url_or_path)
        : test_url_or_path

    const __dirname = dirname(__filename)

    const abs_path = join(__dirname, module_path)
    const file_url = pathToFileURL(abs_path)

    const file_buf = readFileSync(file_url)
    const b64 = file_buf.toString('base64')

    const moduleData = "data:text/javascript;base64," + b64

    return import(moduleData)
}
