// default answer: no - this isn't different than latest
process.exitCode = 1

const { execSync } = require("child_process")
const shell = (cmd) => (execSync(cmd) + '').trim()

const this_package = require('../../package.json')

// 'npm find' stopped working since 18 august 2020.
// const npm_find = shell(`npm s ${this_package.name} --json`)
// package.json and 'npm find..' json dont align/share all property values, but name does.
// const latest_package = JSON.parse(npm_find).find(p => p.name === this_package.name)

const this_version = this_package.version
const latest_version = shell('npx -q t3st -v')

console.log(`local  v ${this_version}`)
console.log(`latest v ${latest_version}`)

if (this_version !== latest_version) {
    console.log('versions are different!')
    process.exitCode = 0
} 
else console.log(`versions match`)
