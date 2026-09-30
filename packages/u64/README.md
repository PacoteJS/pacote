# @pacote/u64

![version](https://badgen.net/npm/v/@pacote/u64)
![minified](https://badgen.net/bundlephobia/min/@pacote/u64)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/u64)

Unsigned 64-bit integers.

This package exists because while modern JavaScript environments support very
large integers via the [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
type, it is not available in older browsers and tooling doesn't always
transpile `BigInt` operations into a backwards-compatible format.

`U64` also turned out to be more performant than `BigInt` in tests. `@pacote`'s
implementation of the XXH64 algorithm based on `U64` is 4.5 times faster than
the one based on `BigInt`, although optimizations to JavaScript runtimes might
change this in the future.

If you target ECMAScript 2020 or later, and you do not care about the
differences in performance, you will _probably_ not need this.

The `U64` type provided by this package is represented as a tuple of four 16-bit
integers. For example, the number 1 is `[1, 0, 0, 0]`. It is not an object class
with built-in methods. Instead of methods, the package provides functions to
support commonly-used operations.

## Installation

```bash
yarn add @pacote/u64
```

## Example

```typescript
import { add, from, toString } from '@pacote/u64'

const result = add(from('1609587929392839161'), from('9650029242287828579'))

toString(result) // -> '11259617171680667740'
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
