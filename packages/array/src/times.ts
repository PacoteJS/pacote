function _times<T>(
  acc: T[],
  index: number,
  stop: number,
  fn: (i: number) => T
): T[] {
  return index < stop ? _times([...acc, fn(index)], index + 1, stop, fn) : acc
}

export function times<T>(n: number, fn: (i: number) => T): T[] {
  return _times([], 0, n, fn)
}
