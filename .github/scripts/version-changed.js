const { execSync } = require("child_process")
const shell = (cmd) => (execSync(cmd) + '').trim()

const this_package = require('../../package.json')

const this_version = this_package.version
const latest_version = shell('npx -q t3st -v')

console.log(this_version !== latest_version)