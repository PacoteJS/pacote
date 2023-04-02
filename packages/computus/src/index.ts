function integerDivision(dividend: number, divider: number): number {
  return Math.floor(dividend / divider)
}

/**
 * This function takes a year and returns a `Date` object with the Gregorian
 * calendar Easter day on that year at midnight.
 *
 * The function uses a version of the Meeus/Jones/Butcher algorithm published
 * by _New Scientist_ on 30 March 1961.
 *
 * @example
 * ```typescript
 * import { gregorian } from '@pacote/computus'
 *
 * gregorian(2020) // .toLocaleDateString() => '4/12/2020'
 * ```
 *
 * @param year Year.
 *
 * @returns Easter date for the provided year.
 */
export function gregorian(year: number): Date {
  const a = year % 19
  const b = integerDivision(year, 100)
  const c = year % 100
  const d = integerDivision(b, 4)
  const e = b % 4
  const g = integerDivision(8 * b + c, 25)
  const h = (19 * a + b - d - g + 15) % 30
  const i = integerDivision(c, 4)
  const k = c % 4
  const l = (2 * e + 2 * i - h - k + 32) % 7
  const m = integerDivision(a + 11 * h + 19 * l, 433)
  const n = integerDivision(h + l - 7 * m + 90, 25)
  const p = (h + l - 7 * m + 33 * n + 19) % 32

  return new Date(year, n - 1, p)
}

/**
 * This function takes a year and returns a `Date` object with the Eastern
 * Orthodox Easter day on that year at midnight. Please note that this date
 * is returned for the Gregorian calendar, 13 days (as of 1900 through 2099)
 * after the Julian date.
 *
 * The function implements the Jean Meeus algorithm from his book
 * _Astronomical Algorithms_ (1991).
 *
 * @example
 * ```typescript
 * import { julian } from '@pacote/computus'
 *
 * julian(2020) // .toLocaleDateString() => '4/19/2020'
 * ```
 *
 * @param year Year.
 *
 * @returns Eastern Orthodox Easter date for the provided year.
 */
export function julian(year: number): Date {
  const a = year % 4
  const b = year % 7
  const c = year % 19
  const d = (19 * c + 15) % 30
  const e = (2 * a + 4 * b - d + 34) % 7
  const month = integerDivision(d + e + 114, 31)
  const day = ((d + e + 114) % 31) + 1

  return new Date(year, month - 1, day + 13)
}
