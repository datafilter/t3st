const { spawn, execSync } = require("child_process")

const shell = (cmd) => execSync(cmd) + ''

const watch_header = require('./watch_msg')

const is_package_installed = (pkg) => {
    const local = shell(`npm ls -p`).split('\n')
    const global = () => shell(`npm ls -p -g --depth=0`).split('\n')

    const node_path = require('path').join('node_modules', pkg)

    return local.some(l => l.endsWith(node_path)) ||
        global().some(g => g.endsWith(node_path))
}

const cache_msg = (pkg) =>
    is_package_installed(pkg)
        ? false
        : `* To speed up reload, install ${pkg}. Eg: npm i -D ${pkg}`

module.exports = () => {

    let notify_t3st = false
    let notify_nodemon = false

    // TODO optional pass additional options to spawned t3st.

    console.log('Starting watch mode..')

    const t3stmon = spawn(`npx`, [`nodemon`, `-q`, `-x`, `'npx t3st --watch_mode=true'`], { shell: true })

    t3stmon.stdout.setEncoding('utf8')
    t3stmon.stdout.on('data', (data) => {
        const s = data.toString()
        if (s.startsWith(watch_header)) {
            console.clear()
            if (notify_t3st)
                console.log(notify_t3st)
            if (notify_nodemon)
                console.log(notify_nodemon)
        }
        process.stdout.write(s) // not console.log, as it prints unwanted additional newlines
    })

    t3stmon.stderr.setEncoding('utf8')
    t3stmon.stderr.on('data', (_data) => {
        console.log('Missing npm package(s): t3st and/or nodemon.')
        console.time('checked in')
        console.log('Checking dependencies..')
        notify_t3st = cache_msg(`t3st`)
        notify_nodemon = cache_msg(`nodemon`)
        console.timeEnd('checked in')
    })
}