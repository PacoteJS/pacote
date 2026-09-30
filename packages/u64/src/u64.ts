/**
 * Unsigned 64-bit integer represented as four little-endian 16-bit blocks.
 *
 * The tuple representation works without `BigInt` and can be faster for the
 * operations used by the package's XXH64 implementation.
 */
export type U64 = readonly [number, number, number, number]

export const overflow = (value: number) => value >>> 16
export const clamp = (value: number) => value & 0xffff

export function fromNumber(value: number): U64 {
  return [clamp(value), overflow(value), 0, 0]
}

/**
 * Converts the low 32 bits of a `U64` value to a JavaScript number.
 *
 * JavaScript numbers cannot represent every 64-bit integer exactly; values
 * above the low 32-bit range cannot be converted losslessly by this function.
 * @param value - Value to convert.
 * @returns Its low 32-bit numeric portion.
 */
export function toNumber(value: U64): number {
  return value[1] * 2 ** 16 + value[0]
}

/**
 * Represents the zero value, or `[0, 0, 0, 0]`.
 * @readonly
 * @group Constants
 */
export const ZERO = fromNumber(0)

export function clampBlocks([v0, v1, v2, v3]: U64): U64 {
  return [clamp(v0), clamp(v1), clamp(v2), clamp(v3)]
}
