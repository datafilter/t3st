// default answer: no - this isn't different than latest
process.exitCode = 1

const { execSync } = require("child_process")
const shell = (cmd) => execSync(cmd) + ''

const this_package = require('../../package.json')
const npm_find = shell(`npm s ${this_package.name} --json`)

// package.json and 'npm find..' json dont align/share all property values, but name does.
const latest_package = JSON.parse(npm_find).find(p => p.name === this_package.name)

if (latest_package) {

    const this_version = this_package.version
    const latest_version = latest_package.version

    console.log(`local  v ${this_version}`)
    console.log(`latest v ${latest_version}`)

    // not require('semver'), but sufficient.
    // if 1.01.3 !== 1.1.03 then npm publish will figure things out or error in that step.
    if (this_version !== latest_version) {
        console.log('versions are different!')
        process.exitCode = 0
    } else console.log(`versions match`)
} else {
    console.log(`did not find package with name ${this_package.name || 'none'} and author ${this_package.author || 'none'}`)
}