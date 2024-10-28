import { unique } from './unique'

/**
 * Returns the intersection between two arrays.
 *
 * @example
 * ```typescript
 * import { intersect } from '@pacote/array'
 *
 * intersect(['a', 'b', 'c'], ['b', 'c', 'd']) // => ['b', 'c']
 * ```
 *
 * @template T The type of the elements in the arrays.
 *
 * @param left The first array.
 * @param right The second array.
 *
 * @returns The unique elements present in both arrays.
 */
export function intersect<T>(left: readonly T[], right: readonly T[]): T[] {
  return unique(left.filter((value) => right.includes(value)))
}
