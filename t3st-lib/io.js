const fs = require('fs')
const path = require('path')

const sub_paths = (dir) =>
    fs.statSync(dir).isFile()
        ? []
        : fs.readdirSync(dir).map(sub_path => path.join(dir, sub_path))

const leaves = (node, node_children) => {
    const ls = (node) => {
        const descendants = node_children(node).flatMap(c => ls(c))
        return descendants.length ? descendants : [node]
    }
    return ls(node)
}

const walk_dir = (dir) => leaves(dir, sub_paths).flat(99)

const flagExitError = () => require('process').exitCode = 1

module.exports = { walk_dir, flagExitError }