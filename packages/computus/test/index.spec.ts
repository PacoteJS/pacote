import { describe, test, expect } from 'vitest'
import { assert, property, integer } from 'fast-check'
import { gregorian, julian } from '../src/index'

describe('Gregorian calendar Easter', () => {
  test('21 April 2019', () => {
    expect(gregorian(2019)).toEqual(new Date(2019, 3, 21))
  })

  test('always on or after 22 March', () => {
    assert(
      property(integer({ min: 1583, max: 65536 }), (year) => {
        expect(gregorian(year).getTime()).toBeGreaterThanOrEqual(
          new Date(year, 2, 22).getTime(),
        )
      }),
    )
  })

  test('always on or before 25 April', () => {
    assert(
      property(integer({ min: 1583, max: 65536 }), (year) => {
        expect(gregorian(year).getTime()).toBeLessThanOrEqual(
          new Date(year, 3, 25).getTime(),
        )
      }),
    )
  })

  test('always on a Sunday', () => {
    assert(
      property(integer({ min: 1583, max: 65536 }), (year) => {
        expect(gregorian(year).getDay()).toBe(0)
      }),
    )
  })
})

describe('Julian calendar Easter', () => {
  test('27 April 2008', () => {
    expect(julian(2008)).toEqual(new Date(2008, 3, 27))
  })

  test('19 April 2009', () => {
    expect(julian(2009)).toEqual(new Date(2009, 3, 19))
  })

  test('4 April 2010', () => {
    expect(julian(2010)).toEqual(new Date(2010, 3, 4))
  })

  test('24 April 2011', () => {
    expect(julian(2011)).toEqual(new Date(2011, 3, 24))
  })

  test('1 May 2016', () => {
    expect(julian(2016)).toEqual(new Date(2016, 4, 1))
  })

  test('always on a Sunday', () => {
    assert(
      property(integer({ min: 1900, max: 2099 }), (year) => {
        expect(julian(year).getDay()).toBe(0)
      }),
    )
  })
})
