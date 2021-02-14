import { xxh64 } from '@pacote/xxhash'

function toUint32(hex: string): number {
  return parseInt(hex.substr(8, 8), 16)
}

export function hashLocations(size: number, hashes: number, seed: number) {
  const h1 = xxh64(seed + 1)
  const h2 = xxh64(seed + 2)

  const enhancedDoubleHash = (data: string, size: number, i: number) =>
    (toUint32(h1.update(data).digest('hex')) +
      i * toUint32(h2.update(data).digest('hex')) +
      i ** 3) %
    size

  return (data: string) =>
    Array.from({ length: hashes }, (_, i) => enhancedDoubleHash(data, size, i))
}
