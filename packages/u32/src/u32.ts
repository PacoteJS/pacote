/**
 * Unsigned 32-bit integer represented as two little-endian 16-bit blocks.
 *
 * This tuple-based implementation supports runtimes and toolchains where
 * `BigInt` is unavailable.
 */
export type U32 = readonly [number, number]

/**
 * Creates a `U32` value from a JavaScript number.
 * @param value - Number to convert.
 * @returns The corresponding `U32` value.
 */
export function fromNumber(value: number): U32 {
  return [value & 0xffff, value >>> 16]
}

/**
 * Converts a `U32` value to a JavaScript number.
 * @param value - Value to convert.
 * @returns The numeric value.
 */
export function toNumber(value: U32): number {
  return value[1] * 2 ** 16 + value[0]
}

/** The `U32` value zero. */
export const ZERO = fromNumber(0)
