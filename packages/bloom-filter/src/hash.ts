import { h64 } from 'xxhashjs'

export function hashLocations(size: number, hashes: number, seed: number) {
  const h1 = h64(seed + 1)
  const h2 = h64(seed + 2)

  const enhancedDoubleHash = (data: string, size: number, i: number) =>
    (h1.update(data).digest().toNumber() +
      i * h2.update(data).digest().toNumber() +
      i ** 3) %
    size

  return (data: string) =>
    Array.from({ length: hashes }, (_, i) => enhancedDoubleHash(data, size, i))
}
