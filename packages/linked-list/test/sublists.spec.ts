import { describe, test, expect } from 'vitest'
import * as fc from 'fast-check'
import * as L from '../src/index'

const arbitraryArray = fc.array(fc.anything())

describe('take()', () => {
  test('returns an empty list for offsets lower than 1', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.take(0, list)).toEqual(L.listOf())
  })

  test('returns a number of items taken from the start of the list', () => {
    const list = L.listOf(1, 2, 3)
    const expected = L.listOf(1, 2)
    const actual = L.take(2, list)
    expect(actual).toEqual(expected)
  })

  test('returns all the items if more are taken than exist', () => {
    const list = L.listOf(1, 2, 3)
    const actual = L.take(4, list)
    expect(actual).toEqual(list)
  })

  test('list of taken items is smaller or equal to the number requested', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: Number.MAX_SAFE_INTEGER }),
        arbitraryArray,
        (offset, array) => {
          const list = L.listOf(...array)
          const length = L.length(L.take(offset, list))
          expect(length).toBeLessThanOrEqual(offset)
        },
      ),
    )
  })
})

describe('drop()', () => {
  test('removes everything for offsets equal to or higher than the list length', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.drop(3, list)).toEqual(L.listOf())
  })

  test('returns the original list if no items are dropped', () => {
    const list = L.listOf(1, 2, 3)
    const actual = L.drop(0, list)
    expect(actual).toEqual(list)
  })

  test('removes the requested items from the start of the list', () => {
    const list = L.listOf(1, 2, 3)
    const expected = L.listOf(3)
    const actual = L.drop(2, list)
    expect(actual).toEqual(expected)
  })
})

describe('remove()', () => {
  test('returns the list unchanged if empty', () => {
    const list = L.listOf()
    expect(L.remove(0, list)).toEqual(list)
  })

  test('returns an empty list if the list has a single element', () => {
    const list = L.listOf(1)
    const emptyList = L.listOf()
    expect(L.remove(0, list)).toEqual(emptyList)
  })

  test('removes an element from the middle of the list', () => {
    const list = L.listOf(1, 2, 3, 4, 5)
    const expected = L.listOf(1, 2, 4, 5)
    expect(L.remove(2, list)).toEqual(expected)
  })

  test('an invalid index leaves the list unchanged', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.remove(99, list)).toEqual(list)
  })
})

describe('slice()', () => {
  test('any slice of an empty list is an empty list', () => {
    const emptyList = L.listOf()
    expect(L.slice(0, 1, emptyList)).toEqual(emptyList)
  })

  test('slicing a list between two indices', () => {
    const list = L.listOf(1, 2, 3, 4)
    const expected = L.listOf(2, 3)
    expect(L.slice(1, 3, list)).toEqual(expected)
  })

  test('slicing before the start of the list returns the list from the start', () => {
    const list = L.listOf(1, 2, 3, 4)
    const expected = L.listOf(1, 2)
    expect(L.slice(-1, 2, list)).toEqual(expected)
  })

  test('slicing past the end of the list returns the list until the end', () => {
    const list = L.listOf(1, 2, 3, 4)
    const expected = L.listOf(3, 4)
    expect(L.slice(2, 5, list)).toEqual(expected)
  })

  test('an exact slice returns the full list', () => {
    const list = L.listOf(1, 2, 3, 4)
    expect(L.slice(0, 4, list)).toEqual(list)
  })

  test('a list can be sliced from a starting index', () => {
    const list = L.listOf(1, 2, 3, 4)
    const expected = L.listOf(3, 4)
    expect(L.slice(2, list)).toEqual(expected)
  })
})

describe('unique()', () => {
  test('empty lists', () => {
    const list = L.listOf()
    expect(L.unique(list)).toEqual(list)
  })

  test('lists with different values', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.unique(list)).toEqual(list)
  })

  test('lists with a single element repeated', () => {
    const list = L.listOf(1, 1, 1)
    const expected = L.listOf(1)
    expect(L.unique(list)).toEqual(expected)
  })

  test('unique elements are returned in order', () => {
    const list = L.listOf(1, 2, 1, 3)
    const expected = L.listOf(1, 2, 3)
    expect(L.unique(list)).toEqual(expected)
  })
})
