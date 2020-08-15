
const usage =
    `Usage:	t3st [COMMAND] [OPTIONS]

A small and light javascript test framework.

['clear', 'dir', 'filter', 'gen', 'help', 'silent', 'test', 'verbose', 'watch'])

Commands:
    gen <path>      Generate a new test file:
                        t3st gen test.js
                        t3st gen sub/path/test.js

                    Generate a new file, and a new test file:
                        t3st gen --ref /lib/feature.js

    help            Display this help message.

    test            Run the tests. This is the default if you don't specify any commands.

    watch           Watch for changes in .js files, and rerun tests.
                    Also known as live tests, or hot reloading.

Options:
    --clear         Clear the console before running.

    --dir <path>    Specify the target directory of tests to run.
                    Defaults to pwd/tests (current directory/tests)
                        t3st --dir usr/temp/my-project/tests

                    When used with the gen command, specify the target directory to create tests in:
                        t3st --dir /over/there test.js
                        t3st --dir /over/yonder --ref /lib/feature.js

    --filter        Specify a file pattern match to use for finding tests.
        <pattern>   The default filter is *.js
                        t3st -f *.spec.js
                        t3st -f *.mjs

    --silent        Do not write any test result output to console.

                    Invalid t3st command line input will still be shown.
                    The exit code of 0 (success) or 1 (failure) is still set.

    --ref           Specify a file to create with the gen command.

    --verbose       Display the names of each passing test.

Running t3st with defaults:
    t3st
    t3st test --dir \${pwd}/tests --filter *.js # same as 't3st' without options.

The very first argument can also be specified with just the starting letter.
    t3st s
    # t3st -d \${pwd}/tests -f *.js --silent

More than one option without <value> can flagged at the same time
    t3st w -d /tests -f *.spec.js -cv
    # t3st watch --dir /tests --filter *.spec.js --clear --verbose
`
// examples can be found [here](link)

const _more =
`Usage:
    t3st help           To display main usage page.
    t3st help <topic>   To display info about a specific topic,
                        where <topic> is one of the following:
                        --- Command line options ---
                        gen, watch, clear,
                        dir, filter, silent, verbose
                        ------ Test functions ------
                        test, assert, affirm, alike
`

module.exports = (_topic) => {
    // const info = !topic && usage || topic === 'more' && more ||
    //     `Topic "${topic}" is not a help topic.\n${more}`
    const info = usage
    console.log(info)
}