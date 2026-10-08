import { xxh64 } from '@pacote/xxhash'
import type { HashFunction } from './options'

function toUint32(hex: string): number {
  return Number.parseInt(hex.substring(8, 16), 16)
}

/**
 * Seeded XXH64 with enhanced double hashing, as in `@pacote/bloom-filter`.
 * Not memoised: that is up to callers.
 */
export function defaultHash(seed: number): HashFunction {
  const h1 = xxh64(seed + 1)
  const h2 = xxh64(seed + 2)

  return (i, data) => {
    const d1 = toUint32(h1.update(data).digest('hex'))
    const d2 = toUint32(h2.update(data).digest('hex'))
    return d1 + i * d2 + i ** 3
  }
}
