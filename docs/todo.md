# Features/Bugs

- Missing tests folder and/or better discovery/errors wrt tests
- Mixed mode parameter, eg: -mix (defaults to .t3.js) or -mix:spec.js -> tests project dir with endswith filter.
- Add optional runtime stats arg, eg: -time, -time:avg, -time:total,avg,slowest
- Highlight differences in alike erros, eg for 
    {name : 'mark', age : 20, location : 'there'} 
    vs
    {name : 'mark', age : 40, awake : true}
  show: age[20/40], location['there',] awake[,true]
- Perf

# Refactor

- Remove index.js, only export validation.js
- Sub-organise tests folder into validation, io, run, text and other t3st-lib.

# Test

- io, especially walk_dir if dir doesn't exist.
- tests for cli cases.

# Notes

```js
const maybe_json = (v, to_json) => to_json ? JSON.stringify(v, null, 2) : v
const objectify_functional = (obj, [k, v]) => ({ ...obj, [k]: v })
const objectify = (obj, [k, v]) => (obj[k] = v, obj) //non-functional, more performant.

const obj_string = (v, to_json = true) =>
    typeof v === 'object' && v !== null
        ? maybe_json(
            Object.entries(v)
                .sort(([a_key, _a], [b_key, _b]) => a_key.localeCompare(b_key))
                .map(([key, val]) => [key, obj_string(val, false)])
                .reduce(objectify, {})
            , to_json)
        : typeof v === 'function'
            ? `${v}`
            : v
```

```js
  console.log('-'.repeat(40))
  const before_test = process.hrtime()

  await run({ dir: 'tests', label: 'framework' })
  // await run({ dir: 'play', label: 'play' })
  // await run()

  const runtime = process.hrtime(before_test)
  console.log('runtime: %ds %dms', runtime[0], runtime[1] / 1000000)
  ```