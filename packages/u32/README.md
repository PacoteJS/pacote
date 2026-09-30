# @pacote/u32

![version](https://badgen.net/npm/v/@pacote/u32)
![minified](https://badgen.net/bundlephobia/min/@pacote/u32)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/u32)

Unsigned 32-bit integers.

This package exists because while modern JavaScript environments support very
large integers via the [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
type, it is not available in older browsers and tooling doesn't always
transpile `BigInt` operations into a backwards-compatible format.

If you target ECMAScript 2020 or later, you will probably not need this.

The `U32` type provided by this package is represented as a tuple of two 16-bit
integers. For example, the number 1 is `[1, 0]`. It is not an object class with
built-in methods. Instead of methods, the package provides functions to support
commonly-used operations.

## Installation

```bash
yarn add @pacote/u32
```

## Example

```typescript
import { add, from, toString } from '@pacote/u32'

const result = add(from('4294967296'), from('4294967295'))

toString(result) // -> '8589934591'
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
