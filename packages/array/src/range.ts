export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, index) => start + index)
}
