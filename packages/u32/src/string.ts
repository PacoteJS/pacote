import { toNumber, type U32 } from './u32'

/**
 * Parses a numeric string into a `U32` tuple using the specified base.
 * @param value - Numeric string to parse.
 * @param radix - Base used to parse the string.
 * @returns The parsed value.
 */
export function fromString(value: string, radix: number): U32 {
  const result = Number.parseInt(value, radix)
  return [result & 0xffff, result >>> 16]
}

const PADDING: Record<number, number | undefined> = {
  2: 32,
  16: 8,
}

/**
 * Converts a `U32` value to a string in the specified base (default 10).
 * @param value - Value to convert.
 * @param radix - Numeric base for the result.
 * @returns The string representation.
 */
// biome-ignore lint/suspicious/noShadowRestrictedNames: global toString not used
export function toString(value: U32, radix = 10): string {
  return toNumber(value)
    .toString(radix)
    .padStart(PADDING[radix] ?? 0, '0')
}
