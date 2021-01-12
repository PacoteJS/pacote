export function optimal(items: number, errorRate: number) {
  const size = Math.ceil(-(items * Math.log(errorRate)) / Math.LN2 ** 2)
  const hashes = Math.round((size / items) * Math.LN2)
  return { size, hashes }
}
