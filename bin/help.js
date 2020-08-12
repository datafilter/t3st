
const usage =
    `Usage:	t3st [COMMAND] [OPTIONS]

A small and light javascript test framework

['clear', 'dir', 'filter', 'gen', 'help', 'init', 'silent', 'verbose', 'watch'])

Commands:
    gen <file>      Generate a new file and/or test file for a given path.
                    Eg: t3st gen /lib/text.js
    help            Display this help message
    init            Initialize a tests and lib directory, with a demo test.
    watch           Watch for changes in .js files, and rerun tests.
                    Also known as live tests, or hot reloading.

Options:
    --clear         Clear the console before running
    --dir <path>    Specify the target directory of tests.
                    Defaults to pwd/tests (current directory/tests)
                    eg: t3st --directory usr/temp/my-project/tests
    --filter        Specify a file pattern match to use for testing.
                    Eg: t3st -f *.spec.js (the default is *.js)
    --silent        Do not write any output to console.
                    The exit code of 0 (success) or 1 (failure) is still set.
    --verbose       Display the names of each passing test.

Running t3st without any options defaults to:
    t3st --dir \${pwd}/tests --filter *.js

The very first argument can also be specified with just the starting letter, eg:
    t3st s 
    # t3st -d \${pwd}/tests -f *.js --silent

More than one option without <value> can flagged at the same time, eg:
    t3st w -d /tests -f *.spec.js -cv 
    # t3st watch --dir /tests --filter *.spec.js --clear --verbose

`
// examples can be found [here](link)

module.exports = { usage }