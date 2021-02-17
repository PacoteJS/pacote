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

## Usage

```typescript
import { add, from, toString } from '@pacote/u32'

const result = add(from('4294967296'), from('4294967295'))

toString(result) // -> '8589934591'
```

## Constants

### `ZERO`

Represents the zero value, or `[0, 0]`.

## Creation functions

### `from(value: number): U32`

Creates a new `U32` from a number.

### `from(value: string, radix?: number): U32`

Creates a new `U32` from a numeric string in any base. If not provided, `radix`
defaults to `10`.

## Arithmetic functions

### `add(augend: U32, addend: U32): U32`

Adds two `U32` values. Equivalent to the numeric `+` operator.

### `subtract(minuend: U32, subtrahend: U32): U32`

Subtracts two `U32` values. Equivalent to the numeric `-` operator.

### `multiply(multiplier: U32, multiplicand: U32): U32`

Multiplies two `U32` values. Equivalent to the numeric `*` operator.

### `divide(dividend: U32, divisor: U32): U32`

Divides two `U32` values. Since these are integers, this operation will round
towards zero (which is to say, it will not return any fractional digits).

### `remainder(dividend: U32, divisor: U32): U32`

The remainder of the division of two `U32` values. Equivalent to the numeric `%`
operator.

### `negate(value: U32): U32`

Negates the supplied `value`.

## Comparison functions

### `equals(a: U32, b: U32): U32`

Compares two `U32` values and returns `true` if they are numerically equivalent,
otherwise returns `false`.

### `lessThan(a: U32, b: U32): U32`

Compares two `U32` values and returns `true` if `a` is smaller than `b`,
otherwise returns `false`.

### `greaterThan(a: U32, b: U32): U32`

Compares two `U32` values and returns `true` if `a` is greater than `b`,
otherwise returns `false`.

## Binary bitwise functions

### `and(a: U32, b: U32): U32`

The bitwise AND function returns a `1` in each bit position for which the
corresponding bits of both operands are `1`s. Equivalent to the numeric `&`
operator.

### `or(a: U32, b: U32): U32`

The bitwise OR function returns a `1` in each bit position for which the
corresponding bits of either operand are `1`s. Equivalent to the numeric `|`
operator.

### `xor(a: U32, b: U32): U32`

The bitwise XOR function returns a `1` in each bit position for which the
corresponding bits of either but not both operands are `1`s. Equivalent to the
numeric `^` operator.

## Bitwise shift functions

### `rotateLeft(value: U32, bits: number): U32`

The left rotate function circularly shifts the `value` the specified number of
`bits` to the left. Bits shifted off to the left appear on the right.

### `rotateRight(value: U32, bits: number): U32`

The right rotate function circularly shifts the `value` the specified number of
`bits` to the right. Bits shifted off to the right appear on the left.

### `shiftLeft(value: U32, bits: number): U32`

The left shift function shifts the `value` the specified number of `bits` to the
left. Excess bits shifted off to the left are discarded. Zero bits are shifted
in from the right. Equivalent to the numeric `<<` operator.

### `shiftRight(value: U32, bits: number): U32`

The right shift function shifts the `value` the specified number of `bits` to
the right. Excess bits shifted off to the right are discarded. Zero bits are
shifted in from the left. The sign bit becomes 0, so the result is always
non-negative. Equivalent to the numeric `>>>` operator.

## Conversion functions

### `toNumber(value: U32): number`

Coerces a `U32` value to `number`.

### `toString(value: U32, radix?: number): string`

Returns a string representing the `value` in the specified `radix` (base). If
not provided `radix` defaults to `10`.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
