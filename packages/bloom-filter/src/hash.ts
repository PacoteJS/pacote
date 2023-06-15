import { memoize } from '@pacote/memoize'
import { xxh64 } from '@pacote/xxhash'

function toUint32(hex: string): number {
  return parseInt(hex.substring(8, 16), 16)
}

export function defaultHash(seed: number) {
  const h1 = xxh64(seed + 1)
  const h2 = xxh64(seed + 2)

  return memoize(
    (i: number, data: string) => String(i) + ':' + data,
    (i: number, data: string): number => {
      const d1 = toUint32(h1.update(data).digest('hex'))
      const d2 = toUint32(h2.update(data).digest('hex'))
      return d1 + i * d2 + i ** 3
    }
  )
}
