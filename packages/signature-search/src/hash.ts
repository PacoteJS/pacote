import { memoize } from '@pacote/memoize'
import type { U64 } from '@pacote/u64'
import { type XXHash, xxh64 } from '@pacote/xxhash'

export type HashFunction = (i: number, token: string) => number

export function createHash(seed: number): HashFunction {
  const h1 = memoizedHash(xxh64(seed + 1))
  const h2 = memoizedHash(xxh64(seed + 2))

  return (i, data) => h1(data) + i * h2(data) + i ** 3
}

const memoizedHash = (hash: XXHash<U64>) =>
  memoize(String, (data) =>
    Number.parseInt(hash.update(data).digest('hex').substring(8, 16), 16),
  )
