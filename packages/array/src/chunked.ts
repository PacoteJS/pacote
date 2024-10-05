/**
 * Returns a chunked array of the provided array's elements.
 *
 * Size must be positive and can be greater than the number of elements in this
 * collection.
 *
 * @example
 * ```typescript
 * import { chunked } from '@pacote/array'
 *
 * const array = [1, 2, 3, 4]
 *
 * chunked(2, array) // => [[1, 2], [3, 4]]
 * chunked(3, array) // => [[1, 2, 3], [4]]
 * ```
 *
 * @param  size   The number of elements to take in each chunk.
 * @param  array  The array to chunk.
 *
 * @returns Chunked array of the provided array's elements.
 */
export function chunked<T>(size: number, array: readonly T[]): T[][] {
  if (size <= 0) throw Error('size must be a positive integer')

  const chunks = []
  let index = 0

  while (index < array.length) {
    chunks.push(array.slice(index, index + size))
    index += size
  }

  return chunks
}
