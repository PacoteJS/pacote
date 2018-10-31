# @pacote/memoize

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)

Speed up consecutive calls of the same function with the same arguments by caching its results.

## Installation

```bash
yarn add @pacote/memoize
```

## Usage

```typescript
import { memoize } from '@pacote/memoize'

const randomFunction = (max: number) => max * Math.random()
const memoizedFunction = memoize(i => `{i}`, randomFunction)

memoizedFunction(1) // Randomly-generated number between 0 and 1.
memoizedFunction(1) // Same result as previous call with 1.

memoizedFunction(10) // New randomly-generated number between 0 and 10.
memoizedFunction(10) // Same result as previous call with 10.
```

## `memoize<A, T>(cacheKeyFn: (...args: A) => string, fn: (...args: A) => T): (...args: A) => T`

`memoize()` takes two function arguments:

- A function that generates a string key for cached results. This function optionally
  takes the same arguments as the function to memoize.

- The function to memoize.

`memoize()` returns a version of the function provided as the second argument
that caches results.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
