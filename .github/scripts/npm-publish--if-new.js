const { execSync } = require("child_process")
const shell = (cmd) => (execSync(cmd) + '').trim()

const this_package = require('../../package.json')

const this_version = this_package.version
const latest_version = shell('npx -q t3st -v')

console.log(`local  v ${this_version}`)
console.log(`latest v ${latest_version}`)

if (this_version !== latest_version) {
    console.log('versions are different!')
    console.log(shell('npm publish'))
} 
else console.log(`versions match.`)
