export function findLast<T>(
  array: T[],
  predicate: (value: T) => boolean
): T | undefined {
  if (typeof array.findLast === 'function') {
    return array.findLast(predicate)
  }

  let k = array.length - 1
  while (k >= 0) {
    const v = array[k]
    const result = predicate(v)
    if (result) {
      return v
    }
    k--
  }
  return undefined
}
