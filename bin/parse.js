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

    const alias = ['clear', 'dir', 'filter', 'gen', 'help', 'init', 'silent', 'verbose', 'watch']

    const conf = clia(args, alias)

    if (conf.plain.length) {
        const [command, ...options] = args

        const expected_commands = alias.concat(alias.map(a => a[0]))

        if (!expected_commands.some(e => e === command)) {

            const closest = find_closest_command(command, alias)
            const did_you_mean = `Did you mean 't3st ${closest}' ?`

            return {
                errors: (conf.errors || []).concat([
                    `${command} is not a t3st command.`, `${did_you_mean}`])
            }
        } else return clia([`--${command}`, ...options], alias)
    }
    else return conf
}

module.exports = (args) => {

    const conf = build_config(args)

    const commands_count = [
        conf.opt.gen,
        conf.opt.help,
        conf.opt.init,
        conf.opt.watch
    ].filter(c => c).length

    if (commands_count > 1)
        return {
            errors: (conf.errors || []).concat([
                `If you do specify a command, only specify a single one : gen help init watch`])
        }

    return conf
}
