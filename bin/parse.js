const clia = require('clia')

const find_closest_command = (command, alias) => {
    const c = new Set([...command])
    const [closest] = alias.map(alias => {
        const intersect = new Set([...alias].filter(i => c.has(i))).size
        return [alias, intersect]
    }).reduce(([best, max], [alias, score]) => {
        return score > max ? [alias, score] : [best, max]
    }, ['help', 0])
    return closest
}

const build_config = (args) => {

    const alias = ['clear', 'dir', 'filter', 'gen', 'help', 'noisy', 'ref', 'silent', 'test', 'version', 'watch', 'x']

    const conf = clia(args, alias)

    if (conf.plain.length && !conf.errors) {
        const [command, ...options] = args

        const expected_commands = alias.concat(alias.map(a => a[0]))

        if (!expected_commands.some(e => e === command)) {
            // TODO: if command is a file or directory
            //       run test -d 'command'
            return {
                errors: [`${command} is not a t3st command.`,
                         `Did you mean t3st ${find_closest_command(command, alias)} ?`],
                ...conf
            }
        } else return clia([`--${command}`, ...options], alias)
    }
    else return conf
}

module.exports = (args) => {

    const conf = build_config(args)

    conf.command = {}

    if (conf.opt.help)
        conf.command.help = true
    else if (conf.opt.watch)
        conf.command.watch = true
    else if (conf.opt.gen)
        conf.command.gen = true
    else if (conf.opt.x)
        conf.command.x = true
    else conf.command.test = true

    return conf
}
