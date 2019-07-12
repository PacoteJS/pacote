export function gregorian(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const g = Math.floor((8 * b + c) / 25)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (2 * e + 2 * i - h - k + 32) % 7
  const m = Math.floor((a + 11 * h + 19 * l) / 433)
  const n = Math.floor((h + l - 7 * m + 90) / 25)
  const p = (h + l - 7 * m + 33 * n + 19) % 32

  return new Date(year, n - 1, p)
}
