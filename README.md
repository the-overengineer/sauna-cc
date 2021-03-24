# Software Sauna Coding Challenge

A solution for the [coding challenge](https://github.com/softwaresauna/code-challenge/blob/main/README.md) written in TypeScript.

This solution was written piecemeal on three separate occasions during two days (see commit times). Certain principles were followed:

1. Do not overengineer it, despite my username - most pieces of the implementation could have been written in a more generic manner and then
extended or composed to make them more domain-specific. However, given the nature of the challenge, they are instead all aware of the core
domain to some degree or another, while being relatively easy to change.
2. Keep things descriptive - Type aliases, enumerations, and clear function names were used to make it more or less obvious what each
component does. Comments were sprinkled on top for ease of reading, but in most cases they should not be necessary.
3. Test, to a reasonable degree - Generic or somewhat generic functions were tested. On top of that, tests were added to the integration
layer, almost E2E. Some of it was done in TDD fashion, other bits as assurance of already written behaviour. To be honest, I love tests,
but am not too into TDD. Domain logic in the middle was explicitly not tested unless needed. Instead, to keep the solution reasonably
flexible, an assumption was made that if it works on the bottom level, as well as the top level, the middle layers should be fine.

## Code Structure

The solution can broadly be classified into three parts:

1. A handful of generic utilities for handling data types (collections, in this case)
2. Domain logic pertaining to the raster map, collecting path elements, a "smart" location tracker, and finally a map navigator heavy
on specific domain logic, which answers the question of "where can we navigate from here, given the constraints of the problem"
3. A core index file which glues the map walking together with IO and basic error handling

## Tasks/Running

To run the solution, use `yarn eval <input_file>`

To run the tests, use `yarn test`

To ensure code quality as per linter rules, run `yarn lint`

Two input files from the challenge itself are included in the repo (one valid and one invalid). To run them, do:

```bash

yarn eval bad.map
# or
yarn eval example.map
```
