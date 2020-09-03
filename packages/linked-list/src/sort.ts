export function defaultCompare<T>(a: T, b: T): number {
  if (a === undefined && b === undefined) return 0
  if (a === undefined) return 1
  if (b === undefined) return -1
  if (String(a) < String(b)) return -1
  if (String(a) > String(b)) return 1
  return 0
}
