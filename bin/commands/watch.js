const { spawn, execSync } = require("child_process")

const shell = (cmd) => execSync(cmd) + ''

const watch_header = require('./watch_msg')

let perf_message = ``

const check_packages = () => {

    const installed_packages = shell(`npm ls -p`).split('\n')
        .concat(shell(`npm ls -p -g --depth=0`).split('\n'))
        .map(p => p.replace(/\\/g, '/').trim())
        .filter(s => s.length)

    const is_package_installed = (pkg_end) => installed_packages.some(l => l.endsWith(pkg_end))

    const pkg_end = (pkg) => require('path').join('node_modules', pkg).replace(/\\/g, '/')

    const recommend = (pkg) =>
        is_package_installed(pkg_end(pkg))
            ? '' : `* To speed up reload, install ${pkg}: npm i -D ${pkg}`

    perf_message = `${recommend('t3st')}\n${recommend('nodemon')}`.trim()
}

const rebuild_args = (conf) => {
    const not_watch = (key) => key !== 'watch' && key !== 'w'

    const args = Object.keys(conf.args)
        .filter(not_watch)
        .map(key => conf.args[key].map(val =>
            `--${key}=${val}`).join(` `))
        .join(` `)

    const opts = Object.keys(conf.opt)
        .filter(not_watch)
        .map(o => `--${o}`).join(` `)

    return `${args} ${opts}`
}

module.exports = (conf) => {

    console.log('Starting watch mode..')

    const args = rebuild_args(conf)
    const t3st_command = `"npx t3st --watch_mode=true ${args}"`

    setTimeout(check_packages, 0)

    const t3stmon = spawn(`npx`, [`nodemon`, `-q`, `-x`, t3st_command], { shell: true })

    t3stmon.stdout.setEncoding('utf8')
    t3stmon.stdout.on('data', (data) => {
        const s = data.toString()
        if (s.startsWith(watch_header)) {
            console.clear()
            if (perf_message)
                console.log(perf_message)
        }
        process.stdout.write(s) // not console.log, as it prints unwanted additional newlines
    })

    t3stmon.stderr.setEncoding('utf-8')
    t3stmon.stderr.on('data', (data) => {
        process.stderr.write('' + data)
    })
}