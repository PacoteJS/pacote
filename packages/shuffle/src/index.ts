function random(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min))
}

function swap<T>(i: number, j: number, items: T[]): void {
  const swapped = items[i]
  items[i] = items[j]
  items[j] = swapped
}

/**
 * Returns a randomly shuffled copy of a collection using the Durstenfeld
 * algorithm.
 *
 * The input collection is not modified.
 *
 * @param items - Items to shuffle.
 * @returns A new array containing the same items in random order.
 * @example
 * ```typescript
 * shuffle([1, 2, 3]) // => a shuffled copy of the array
 * ```
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items]
  for (let i = 0; i < items.length - 1; i++) {
    swap(i, random(i, items.length), shuffled)
  }
  return shuffled
}
