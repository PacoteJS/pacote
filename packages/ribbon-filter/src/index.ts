export type {
  HashFunction,
  Options,
  SerialisedRibbonFilter,
} from './options'
export { RibbonFilter } from './ribbon-filter'

// Measured on real bucket sizes (1 to 12,215 keys): final rows per key after
// retries are flat at about 1.09 for overheads from 0 to 0.05, so 0.05 keeps
// that size with the fewest retries. Small tables need the fewest rows with
// one extra row; retrying a small table is cheap.
const OVERHEAD = 0.05
const EXTRA_ROWS = 1

/**
 * Calculates Ribbon filter size and fingerprint bits for a target item count
 * and false positive rate.
 *
 * Fingerprint bits are rounded up, so the actual false positive rate is
 * 2^-fingerprintBits, at most `errorRate`, and no lower than 2^-32.
 *
 * @param items - Number of items the filter will be built from.
 * @param errorRate - Desired false positive probability, between 0 and 1.
 * @returns The number of table rows and the fingerprint bits to use.
 * @example
 * ```typescript
 * import { optimal } from '@pacote/ribbon-filter'
 *
 * const options = optimal(1000, 0.01)
 * ```
 */
export function optimal(
  items: number,
  errorRate: number,
): { size: number; fingerprintBits: number } {
  return {
    size: Math.max(items + EXTRA_ROWS, Math.ceil((1 + OVERHEAD) * items)),
    fingerprintBits: Math.min(32, Math.ceil(Math.log2(1 / errorRate))),
  }
}
