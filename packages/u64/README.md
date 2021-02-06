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

## Constants

### `ZERO`

Represents the zero value, or `[0, 0, 0, 0]`.

## Creation functions

### `from(value: number): U64`

Creates a new `U64` from a number.

### `from(value: string, radix?: number): U64`

Creates a new `U64` from a numeric string in any base. If not provided, `radix`
defaults to `10`.

## Arithmetic functions

### `add(augend: U64, addend: U64): U64`

Adds two `U64` values. Equivalent to the numeric `+` operator.

### `subtract(minuend: U64, subtrahend: U64): U64`

Subtracts two `U64` values. Equivalent to the numeric `-` operator.

### `multiply(multiplier: U64, multiplicand: U64): U64`

Multiplies two `U64` values. Equivalent to the numeric `*` operator.

### `divide(dividend: U64, divisor: U64): U64`

Divides two `U64` values. Since these are integers, this operation will round
towards zero (which is to say, it will not return any fractional digits).

### `remainder(dividend: U64, divisor: U64): U64`

The remainder of the division of two `U64` values. Equivalent to the numeric `%`
operator.

### `negate(value: U64): U64`

Negates the supplied `value`.

## Comparison functions

### `equals(a: U64, b: U64): U64`

Compares two `U64` values and returns `true` if they are numerically equivalent,
otherwise returns `false`.

### `lessThan(a: U64, b: U64): U64`

Compares two `U64` values and returns `true` if `a` is smaller than `b`,
otherwise returns `false`.

### `greaterThan(a: U64, b: U64): U64`

Compares two `U64` values and returns `true` if `a` is greater than `b`,
otherwise returns `false`.

## Binary bitwise functions

### `xor(a: U64, b: U64): U64`

The bitwise XOR function returns a `1` in each bit position for which the
corresponding bits of either but not both operands are `1`s. Equivalent to the
numeric `^` operator.

## Bitwise shift functions

### `rotateLeft(value: U64, bits: number): U64`

The left rotate function shifts the `value` the specified number of `bits` to
the left. Bits shifted off to the left appear on the right.

### `shiftLeft(value: U64, bits: number): U64`

The left shift function shifts the `value` the specified number of `bits` to the
left. Excess bits shifted off to the left are discarded. Zero bits are shifted
in from the right. Equivalent to the numeric `<<` operator.

### `shiftRight(value: U64, bits: number): U64`

The right shift function shifts the `value` the specified number of `bits` to
the right. Excess bits shifted off to the right are discarded. Zero bits are
shifted in from the left. The sign bit becomes 0, so the result is always
non-negative. Equivalent to the numeric `>>>` operator.

## Conversion functions

### `toNumber(value: U64): number`

Coerces a `U64` value to `number`.

Because JavaScript numbers are not 64-bit, precision may be lost when
converting. Only numbers up to `Number.MAX_SAFE_INTEGER` (2^32, or 4294967296)
can be safely converted into `number`.

### `toString(value: U64, radix?: number): string`

Returns a string representing the `value` in the specified `radix` (base). If
not provided `radix` defaults to `10`.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
