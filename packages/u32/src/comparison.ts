import type { U32 } from './u32'

/**
 * Returns whether `a` is numerically less than `b`.
 * @param a - First value.
 * @param b - Second value.
 * @returns Whether `a` is less than `b`.
 */
export function lessThan(a: U32, b: U32): boolean {
  if (a[1] < b[1]) return true
  if (a[1] > b[1]) return false
  return a[0] < b[0]
}

/**
 * Returns whether `a` is numerically greater than `b`.
 * @param a - First value.
 * @param b - Second value.
 * @returns Whether `a` is greater than `b`.
 */
export function greaterThan(a: U32, b: U32): boolean {
  if (a[1] > b[1]) return true
  if (a[1] < b[1]) return false
  return a[0] > b[0]
}

/**
 * Returns whether two `U32` values are numerically equal.
 * @param a - First value.
 * @param b - Second value.
 * @returns Whether the values are equal.
 */
export function equals(a: U32, b: U32): boolean {
  return a[0] === b[0] && a[1] === b[1]
}
