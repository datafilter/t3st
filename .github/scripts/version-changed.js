const { execSync } = require("child_process")
const shell = (cmd) => (execSync(cmd) + '').trim()

const this_package = require('../../package.json')

const this_version = this_package.version
const latest_version = shell('npm view t3st version')

console.log(this_version !== latest_version)