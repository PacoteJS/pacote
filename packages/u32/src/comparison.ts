import type { U32 } from './u32'

export function lessThan(a: U32, b: U32): boolean {
  if (a[1] < b[1]) return true
  if (a[1] > b[1]) return false
  return a[0] < b[0]
}

export function greaterThan(a: U32, b: U32): boolean {
  if (a[1] > b[1]) return true
  if (a[1] < b[1]) return false
  return a[0] > b[0]
}

export function equals(a: U32, b: U32): boolean {
  return a[0] === b[0] && a[1] === b[1]
}
