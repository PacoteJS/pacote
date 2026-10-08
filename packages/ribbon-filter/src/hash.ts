import { xxh64 } from '@pacote/xxhash'
import type { HashFunction } from './options'

/**
 * Independently seeded XXH64 per index, so start, coefficients and
 * fingerprint do not correlate. Not memoised: that is up to callers.
 */
export function defaultHash(seed: number): HashFunction {
  const hashers = [xxh64(seed), xxh64(seed + 1), xxh64(seed + 2)]
  return (index, data) =>
    Number.parseInt(
      hashers[index].update(data).digest('hex').substring(8, 16),
      16,
    )
}
