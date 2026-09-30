import type { Options } from './options'

export { BloomFilter } from './bloom-filter'
export { CountingBloomFilter } from './counting-bloom-filter'

/**
 * Calculates Bloom filter size and hash count for a target item count and
 * false positive rate.
 *
 * @param items - Expected number of items in the filter.
 * @param errorRate - Desired false positive probability, between 0 and 1.
 * @returns The filter size in bits and the number of hashes to use.
 * @example
 * ```typescript
 * import { optimal } from '@pacote/bloom-filter'
 *
 * const options = optimal(1000, 0.01)
 * ```
 */
export function optimal(items: number, errorRate: number): Options {
  const size = Math.ceil(-(items * Math.log(errorRate)) / Math.LN2 ** 2)
  const hashes = Math.round((size / items) * Math.LN2)
  return { size, hashes }
}
