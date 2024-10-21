import { unique } from './unique'

/**
 * Returns the intersection between two arrays.
 *
 * @param left The first array.
 * @param right The second array.
 *
 * @returns The unique elements present in both arrays.
 */
export function intersect<T>(left: readonly T[], right: readonly T[]): T[] {
  return unique(left.filter((value) => right.includes(value)))
}
