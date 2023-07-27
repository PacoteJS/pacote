function _times<T>(
  acc: T[],
  index: number,
  stop: number,
  fn: (i: number) => T,
): T[] {
  return index < stop ? _times([...acc, fn(index)], index + 1, stop, fn) : acc
}

/**
 * Calls a function any number of times, placing the result of each call
 * sequentially in a new array. The function receives a call index starting at 0
 * that matches the position in the new array where the result will be placed.
 *
 * @example
 * ```typescript
 * import { times } from '@pacote/array'
 *
 * times(3, (index) => index) // => [0, 1, 2]
 * ```
 *
 * @param n The number of times to call the function.
 * @param fn Function to execute, receives the call index.
 * @returns Array containing the ordered results for each function call.
 */
export function times<T>(n: number, fn: (index: number) => T): T[] {
  return _times([], 0, n, fn)
}
