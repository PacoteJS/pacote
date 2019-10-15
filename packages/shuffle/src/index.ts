function random(max: number): number {
  return Math.floor(Math.random() * max)
}

function swap<T>(i: number, j: number, items: T[]): T[] {
  const swapped = items[i]
  items[i] = items[j]
  items[j] = swapped
  return items
}

export function shuffle<T>(items: T[]): T[] {
  return items.reduce((shuffled, _, i) => swap<T>(i, random(i), shuffled), [
    ...items
  ])
}
