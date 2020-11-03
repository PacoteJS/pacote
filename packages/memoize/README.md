# @pacote/memoize

![version](https://badgen.net/npm/v/@pacote/memoize)
![minified](https://badgen.net/bundlephobia/min/@pacote/memoize)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/memoize)

Speed up consecutive calls of the same function with the same arguments by caching its results.

## Installation

```bash
yarn add @pacote/memoize
```

## Usage

```typescript
import { memoize } from '@pacote/memoize'

const randomFunction = (prefix: string) => `${prefix}${Math.random()}`

const memoizedFunction = memoize((prefix) => `key_${prefix}`, randomFunction)

memoizedFunction('foo') // 'foo' followed by randomly-generated number.
memoizedFunction('foo') // Same result as previous call with 'foo'.

memoizedFunction('bar') // 'bar' followed by randomly-generated number.
memoizedFunction('bar') // Same result as previous call with 'bar'.
```

### `memoize<A, T>(cacheKeyFn: (...args: A) => string, fn: (...args: A) => T): (...args: A) => T`

`memoize()` takes two function arguments:

- A function that generates a string key for cached results. This function takes the same
  arguments as the function to memoize.

- The function to memoize. `memoize()` returns a version of this function that caches results.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
