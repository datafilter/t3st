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

module.exports = () => {

    const cache_msg = (pkg) =>
        is_package_installed(pkg)
            ? false
            : `* To speed up reload, install ${pkg}. Eg: npm i -D ${pkg}`

    console.time('checked in')
    console.log('Checking dependencies..')

    const notify_t3st = cache_msg(`t3st`)
    const notify_nodemon = cache_msg(`nodemon`)

    console.timeEnd('checked in')

    // TODO optional pass additional options to spawned t3st.

    console.time('startup took')
    console.log('Running npx nodemon t3st..')

    const t3stmon = spawn(`npx`, [`nodemon`, `-q`, `-x`, `'npx t3st --watch_mode=true'`], { shell: true })

    console.timeEnd('startup took')

    t3stmon.stdout.setEncoding('utf8');
    t3stmon.stdout.on('data', (data) => {
        const s = data.toString()
        if (s.startsWith(watch_header)) {
            console.clear()
            if (notify_t3st)
                console.log(notify_t3st)
            if (notify_nodemon)
                console.log(notify_nodemon)
        }
        // console.log prints unwanted newlines:
        process.stdout.write(s)
    })

    t3stmon.stderr.setEncoding('utf8');
    t3stmon.stderr.on('data', (_data) => {
        console.log('Missing npm package(s): t3st and/or nodemon.')
    })
}