function random(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min))
}

function swap<T>(i: number, j: number, items: T[]): void {
  const swapped = items[i]
  items[i] = items[j]
  items[j] = swapped
}

export function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]
  for (let i = 0; i < items.length - 1; i++) {
    swap(i, random(i, items.length), shuffled)
  }
  return shuffled
}
