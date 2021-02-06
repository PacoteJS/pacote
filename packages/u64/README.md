# @pacote/u64

![version](https://badgen.net/npm/v/@pacote/u64)
![minified](https://badgen.net/bundlephobia/min/@pacote/u64)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/u64)

Unsigned 64-bit integers.

While modern JavaScript environments support very large integers via the
[`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
type, it is not available in older browsers and tooling doesn't always
transpile `BigInt` operations into a backwards-compatible format.

If you target ECMAScript 2020 or later, you do not need this package.

The `U64` type provided by this package is represented as a tuple of four 16-bit
integers. For example, the number 1 is `[1, 0, 0, 0]`. It is not an object class
with built-in methods. Instead, the package provides functions to support
commonly-used operations.

## Installation

```bash
yarn add @pacote/u64
```

## Usage

```typescript
import { add, from, toString } from '@pacote/u64'

const result = add(from('1609587929392839161'), from('9650029242287828579'))

toString(result) // -> '11259617171680667740'
```

## Creation functions

### `from(value: number): U64`

### `from(value: string, radix?: number): U64`

## Arithmetic functions

### `add(augend: U64, addend: U64): U64`

### `subtract(minuend: U64, subtrahend: U64): U64`

### `multiply(multiplier: U64, multiplicand: U64): U64`

### `divide(dividend: U64, divisor: U64): U64`

### `remainder(dividend: U64, divisor: U64): U64`

### `negate(value: U64): U64`

## Comparison functions

### `equals(a: U64, b: U64): U64`

### `lessThan(a: U64, b: U64): U64`

### `greaterThan(a: U64, b: U64): U64`

## Binary bitwise functions

### `xor(a: U64, b: U64): U64`

## Bitwise shift functions

### `rotateLeft(value: U64, bits: number): U64`

### `shiftLeft(value: U64, bits: number): U64`

### `shiftRight(value: U64, bits: number): U64`

## Conversion functions

### `toNumber(value: U64): number`

### `toString(value: U64): string`

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
