/**
 * Returns an array of numbers between specified start and end
 * (non inclusive) values.
 *
 * The function is only able to generate ascending ranges.
 *
 * @example
 * ```typescript
 * import { range } from '@pacote/array'
 *
 * range(1, 4) // => [1, 2, 3]
 * ```
 *
 * @param start The start of the range.
 * @param end The end of the range (not included).
 * @returns
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, index) => start + index)
}
