import * as fc from 'fast-check'
import { Some, None } from '@pacote/option'
import * as L from '../src/index'

const arbitraryArray = fc.array(fc.anything())
const arbitraryNonEmptyArray = fc.array(fc.anything(), {
  minLength: 1,
  maxLength: 99,
})

describe('find()', () => {
  test('returns None if the list is empty', () => {
    const emptyList = L.listOf()
    expect(L.find(() => true, emptyList)).toEqual(None)
  })

  test('returns the first item of the list when the predicate is true', () => {
    fc.assert(
      fc.property(arbitraryNonEmptyArray, ([first, ...remaining]) => {
        const list = L.listOf(first, ...remaining)
        const predicate = () => true
        expect(L.find(predicate, list)).toEqual(Some(first))
      })
    )
  })

  test('returns None when the predicate is false', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        const predicate = () => false
        expect(L.find(predicate, list)).toEqual(None)
      })
    )
  })

  test("calls the predicate function for every item in the list until it's satisfied", () => {
    const list = L.listOf(1, 2, 3)
    const predicate = jest.fn((i) => i === 2)

    const actual = L.find(predicate, list)

    expect(predicate).toHaveBeenCalledTimes(2)
    expect(predicate).toHaveBeenCalledWith(1, 0, list)
    expect(predicate).toHaveBeenCalledWith(2, 1, list)

    expect(actual).toEqual(Some(2))
  })
})

describe('findIndex()', () => {
  test('returns None if the list is empty', () => {
    const emptyList = L.listOf()
    expect(L.findIndex(() => true, emptyList)).toEqual(None)
  })

  test('returns the first index of the list when the predicate is true', () => {
    fc.assert(
      fc.property(arbitraryNonEmptyArray, (items) => {
        const list = L.listOf(...items)
        const predicate = () => true
        expect(L.findIndex(predicate, list)).toEqual(Some(0))
      })
    )
  })

  test('returns None when the predicate is false', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        const predicate = () => false
        expect(L.findIndex(predicate, list)).toEqual(None)
      })
    )
  })

  test("calls the predicate function for every item in the list until it's satisfied", () => {
    const list = L.listOf('a', 'b', 'c')
    const predicate = jest.fn((i) => i === 'b')

    const actual = L.findIndex(predicate, list)

    expect(predicate).toHaveBeenCalledTimes(2)
    expect(predicate).toHaveBeenCalledWith('a', 0, list)
    expect(predicate).toHaveBeenCalledWith('b', 1, list)

    expect(actual).toEqual(Some(1))
  })
})

describe('indexOf()', () => {
  test("returns None when the value can't be found", () => {
    const list = L.listOf()
    expect(L.indexOf('value', list)).toEqual(None)
  })

  test('returns 0 when the value is found at the head', () => {
    const list = L.listOf('value')
    expect(L.indexOf('value', list)).toEqual(Some(0))
  })

  test('returns the last index when the value is found at the tail', () => {
    const list = L.listOf('first', 'second', 'value')
    expect(L.indexOf('value', list)).toEqual(Some(2))
  })

  test('returns the index of the value when found', () => {
    const list = L.listOf('first', 'value', 'value', 'third')
    expect(L.indexOf('value', list)).toEqual(Some(1))
  })
})

describe('lastIndexOf()', () => {
  test("returns None when the value can't be found", () => {
    const list = L.listOf()
    expect(L.lastIndexOf('value', list)).toEqual(None)
  })

  test('returns 0 when the value is found at the head', () => {
    const list = L.listOf('value')
    expect(L.lastIndexOf('value', list)).toEqual(Some(0))
  })

  test('returns the last index when the value is found at the tail', () => {
    const list = L.listOf('first', 'second', 'value')
    expect(L.lastIndexOf('value', list)).toEqual(Some(2))
  })

  test('returns the index of the first value from the right', () => {
    const list = L.listOf('first', 'value', 'value', 'third')
    expect(L.lastIndexOf('value', list)).toEqual(Some(2))
  })
})

describe('get()', () => {
  test('returns None for negative indices', () => {
    fc.assert(
      fc.property(fc.integer({ max: -1 }), arbitraryArray, (index, array) => {
        const list = L.listOf(...array)
        expect(L.get(index, list)).toEqual(None)
      })
    )
  })

  test('returns None for out of bounds indices', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.get(3, list)).toEqual(None)
  })

  test('returns the value at index', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.get(2, list)).toEqual(Some(3))
  })

  test('truncates index to integer', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.get(2.5, list)).toEqual(Some(3))
  })
})

describe('at()', () => {
  test('returns None for empty lists', () => {
    const list = L.listOf()
    expect(L.at(0, list)).toEqual(None)
  })

  test('returns None for out of bounds indices', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.at(3, list)).toEqual(None)
  })

  test('returns the value at index', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.at(2, list)).toEqual(Some(3))
  })

  test('returns items from the end of the list for negative indices', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.at(-1, list)).toEqual(Some(3))
  })

  test('truncates index to integer', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.at(2.5, list)).toEqual(Some(3))
    expect(L.at(-1.5, list)).toEqual(Some(3))
  })
})

describe('every()', () => {
  test('returns true for empty lists', () => {
    const list = L.listOf()
    expect(L.every(() => true, list)).toEqual(true)
  })

  test('returns false when predicate is false for at least one item', () => {
    const list = L.listOf(1, 2)
    expect(L.every((value) => value < 2, list)).toEqual(false)
  })

  test('predicate is called for every item until the predicate fails', () => {
    const list = L.listOf(1, 2, 3)
    const predicate = jest.fn((value) => value < 2)

    L.every(predicate, list)

    expect(predicate).toHaveBeenCalledTimes(2)
    expect(predicate).toHaveBeenCalledWith(1, 0, list)
    expect(predicate).toHaveBeenCalledWith(2, 1, list)
  })
})

describe('some()', () => {
  test('returns false for empty lists', () => {
    const list = L.listOf()
    expect(L.some(() => true, list)).toEqual(false)
  })

  test('returns true when predicate is true for at least one item', () => {
    const list = L.listOf(1, 2)
    expect(L.some((value) => value > 1, list)).toEqual(true)
  })

  test('predicate is called for every item until the predicate succeeds', () => {
    const list = L.listOf(1, 2, 3)
    const predicate = jest.fn((value) => value > 1)

    L.some(predicate, list)

    expect(predicate).toHaveBeenCalledTimes(2)
    expect(predicate).toHaveBeenCalledWith(1, 0, list)
    expect(predicate).toHaveBeenCalledWith(2, 1, list)
  })
})

describe('includes()', () => {
  test('returns false for empty lists', () => {
    const list = L.listOf()
    expect(L.includes('value', list)).toEqual(false)
  })

  test('returns true when the list includes the item', () => {
    const list = L.listOf('first', 'second')
    expect(L.includes('value', list)).toEqual(false)
  })

  test('returns false when the list does not include the item', () => {
    const list = L.listOf('first', 'second', 'value')
    expect(L.includes('value', list)).toEqual(true)
  })
})
