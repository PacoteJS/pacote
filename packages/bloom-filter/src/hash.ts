import { h32 } from 'xxhashjs'

export function elementIndexHasher<T extends { toString(): string }>(
  size: number,
  hashes: number,
  seed: number
) {
  const h32s1 = h32(seed + 1)
  const h32s2 = h32(seed + 2)

  const h1 = (element: string) => h32s1.update(element).digest().toNumber()
  const h2 = (element: string) => h32s2.update(element).digest().toNumber()

  function elementIndices(element: T, indices: number[], n: number): number[] {
    if (indices.length === hashes) {
      return indices
    } else {
      const elementString = element.toString()
      const index = Math.abs((h1(elementString) + n * h2(elementString)) % size)

      if (!indices.includes(index)) {
        indices.push(index)
      }

      return elementIndices(element, indices, n + 1)
    }
  }

  return (element: T) => elementIndices(element, [], 1)
}
