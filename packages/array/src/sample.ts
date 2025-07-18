type NonEmptyArray<T> = readonly [T, ...T[]]

function isNotEmpty<T>(value: readonly T[]): value is NonEmptyArray<T> {
  return value.length > 0
}

/**
 * Picks a random element from an array, or `undefined` if the provided array
 * is empty.
 *
 * @example
 * ```typescript
 * import { sample } from '@pacote/array'
 *
 * sample([1, 2, 3]) // => 2
 * sample([1, 2, 3]) // => 1
 * ```
 *
 * @param array The array to sample.
 *
 * @returns Random element from the provided array, or `undefined` if the array
 *          is empty.
 */
export function sample<T>(array: NonEmptyArray<T>): T
export function sample<T>(array: readonly T[]): T | undefined {
  if (!isNotEmpty(array)) return undefined
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Picks a mumber of random elements from an array determined by the sample
 * size.
 *
 * @example
 * ```typescript
 * import { sampleN } from '@pacote/array'
 *
 * sampleN([1, 2, 3], 2) // => [2, 1]
 * sampleN([1, 2, 3], 2) // => [3, 3]
 * ```
 *
 * @param array  The array to sample.
 * @param number A non-negative sample size.
 *
 * @returns Array of random elements from the provided array.
 */
export function sampleN<T>(array: readonly T[], sampleSize: number): T[] {
  if (!isNotEmpty(array)) return []
  const maxSamples = Math.max(0, sampleSize)
  const result = new Array<T>(maxSamples)
  for (let i = 0; i < maxSamples; i++) {
    result[i] = sample(array)
  }
  return result
}
