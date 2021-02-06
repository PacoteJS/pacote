import { U64 } from './u64'

export function lessThan(a: U64, b: U64): boolean {
  if (a[3] < b[3]) return true
  if (a[3] > b[3]) return false
  if (a[2] < b[2]) return true
  if (a[2] > b[2]) return false
  if (a[1] < b[1]) return true
  if (a[1] > b[1]) return false
  return a[0] < b[0]
}

export function greaterThan(a: U64, b: U64): boolean {
  if (a[3] > b[3]) return true
  if (a[3] < b[3]) return false
  if (a[2] > b[2]) return true
  if (a[2] < b[2]) return false
  if (a[1] > b[1]) return true
  if (a[1] < b[1]) return false
  return a[0] > b[0]
}

export function equals(a: U64, b: U64): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3]
}
