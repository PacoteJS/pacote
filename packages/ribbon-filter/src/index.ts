export type {
  HashFunction,
  Options,
  SerialisedRibbonFilter,
} from './options'
export { RibbonFilter } from './ribbon-filter'

/**
 * Calculates Ribbon filter fingerprint bits for a false positive rate.
 *
 * Fingerprint bits are rounded up, so the actual false positive rate is
 * 2^-fingerprintBits, at most `errorRate`, and no lower than 2^-32.
 *
 * @param errorRate - Desired false positive probability, between 0 and 1.
 * @returns The fingerprint bits to use.
 * @example
 * ```typescript
 * import { optimal } from '@pacote/ribbon-filter'
 *
 * const options = optimal(0.01)
 * ```
 */
export function optimal(errorRate: number): { fingerprintBits: number } {
  return { fingerprintBits: Math.min(32, Math.ceil(Math.log2(1 / errorRate))) }
}
