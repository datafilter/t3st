const fs = require('fs')
const path = require('path')

const walk_dir = (dir) => {
    const sub_paths = fs.statSync(dir).isFile()
        ? []
        : fs.readdirSync(dir).map(sub_path => path.join(dir, sub_path))
    const descendants = sub_paths.flatMap(c => walk_dir(c))
    return descendants.length ? descendants : [dir]
}

const flagExitError = () => require('process').exitCode = 1

module.exports = { walk_dir, flagExitError }