/**
 * Returns a tuple with the difference between two arrays.
 *
 * @example
 * ```typescript
 * import { chunked } from '@pacote/array'
 *
 * difference(['a', 'b'], ['b', 'c']) // => [['a'], ['c']]
 * ```
 *
 * @template T The type of the elements in the arrays.
 *
 * @param left  Left array.
 * @param right Right array.
 *
 * @returns Tuple with two arrays: one with elements present in the left array
 *          but not in the right, and the other with elements present in the
 *          right array but not in the left.
 */
export function difference<T>(
  left: readonly T[],
  right: readonly T[],
): [T[], T[]] {
  return [
    left.filter((value) => !right.includes(value)),
    right.filter((value) => !left.includes(value)),
  ]
}
