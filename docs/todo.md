# Features/Bugs

- Missing tests folder and/or better discovery/errors wrt tests
- Mixed mode parameter, eg: -mix (defaults to .t3.js) or -mix:spec.js -> tests project dir with endswith filter.
- Add optional runtime stats arg, eg: -time, -time:avg, -time:total,avg,slowest
- Perf

# Refactor

- Remove index.js, only export validation.js
- Sub-organise tests folder into validation, io, run, text and other t3st-lib.

# Test

- io, especially walk_dir if dir doesn't exist.
- tests for cli cases.