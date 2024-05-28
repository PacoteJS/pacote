function isReadonlyArray<T>(array: unknown): array is readonly T[] {
  return Array.isArray(array)
}

/** @ignore */
export function windowed<T>(size: number, array: readonly T[]): T[][]
/**
 * Returns a snapshot array of a window of the provided size sliding along the
 * provided array with the provided step.
 *
 * Both size and step must be positive and can be greater than the number of
 * elements in this collection.
 *
 * Inspired by Kotlin's
 * [`windowed`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html)
 * method.
 *
 * @example
 * ```typescript
 * import { windowed } from '@pacote/array'
 *
 * const array = [1, 2, 3, 4]
 *
 * windowed(2, array) // => [[1, 2], [2, 3], [3, 4]]
 * windowed(3, array) // => [[1, 2, 3], [2, 3, 4]]
 * windowed(2, 2, array) // => [[1, 2], [3, 4]]
 * ```
 *
 * @param  size   The number of elements to take in each window.
 * @param  [step] The number of elements to move the window forward by on an
 *                each step. Defaults to `1`.
 * @param  array  The array the window slides along.
 *
 * @returns Snapshot array of the window sliding along the provided array.
 */
export function windowed<T>(
  size: number,
  step: number,
  array: readonly T[],
): T[][]
export function windowed<T>(
  size: number,
  stepOrArray: number | readonly T[],
  arrayOrNothing: readonly T[] = [],
): T[][] {
  const [step, array] = isReadonlyArray(stepOrArray)
    ? [1, stepOrArray]
    : [stepOrArray, arrayOrNothing]

  if (size <= 0) throw Error('size must be a positive integer')
  if (step <= 0) throw Error('step must be a positive integer')

  if (array.length === 0) return []
  if (array.length <= size) return [[...array]]

  const indexLimit = array.length - size
  const snapshots = []
  let index = 0

  while (index <= indexLimit) {
    snapshots.push(array.slice(index, index + size))
    index = index + step
  }

  return snapshots
}
