import type { U64 } from './u64'

/**
 * Returns whether `a` is numerically less than `b`.
 * @param a - First value.
 * @param b - Second value.
 * @returns Whether `a` is less than `b`.
 */
export function lessThan(a: U64, b: U64): boolean {
  for (let i = 3; i >= 0; i--) {
    if (a[i] < b[i]) return true
    if (a[i] > b[i]) return false
  }
  return false
}

/**
 * Returns whether `a` is numerically greater than `b`.
 * @param a - First value.
 * @param b - Second value.
 * @returns Whether `a` is greater than `b`.
 */
export function greaterThan(a: U64, b: U64): boolean {
  for (let i = 3; i >= 0; i--) {
    if (a[i] > b[i]) return true
    if (a[i] < b[i]) return false
  }
  return false
}

/**
 * Returns whether two `U64` values are numerically equal.
 * @param a - First value.
 * @param b - Second value.
 * @returns Whether the values are equal.
 */
export function equals(a: U64, b: U64): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3]
}
