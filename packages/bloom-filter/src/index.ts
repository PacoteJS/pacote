import type { Options } from './options'

export { BloomFilter } from './bloom-filter'
export { CountingBloomFilter } from './counting-bloom-filter'

export function optimal(items: number, errorRate: number): Options {
  const size = Math.ceil(-(items * Math.log(errorRate)) / Math.LN2 ** 2)
  const hashes = Math.round((size / items) * Math.LN2)
  return { size, hashes }
}
