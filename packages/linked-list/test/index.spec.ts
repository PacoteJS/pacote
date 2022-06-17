import * as fc from 'fast-check'
import { Some, None } from '@pacote/option'
import * as L from '../src/index'

const arbitraryArray = fc.array(fc.anything())
const arbitraryNonEmptyArray = fc.array(fc.anything(), {
  minLength: 1,
  maxLength: 99,
})

describe('isEmpty()', () => {
  test('new empty lists are empty', () => {
    const list = L.listOf()
    expect(L.isEmpty(list)).toBe(true)
  })

  test('new non-empty lists are not empty', () => {
    const list = L.listOf('value')
    expect(L.isEmpty(list)).toBe(false)
  })
})

describe('length()', () => {
  test('new lists have a length equal to the number of items originally passed', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        expect(L.length(list)).toEqual(items.length)
      })
    )
  })
})

describe('head()', () => {
  test('new empty lists have no head', () => {
    const list = L.listOf()
    expect(L.head(list)).toBe(None)
  })

  test('new non-empty lists have the first item provided as their head', () => {
    fc.assert(
      fc.property(arbitraryNonEmptyArray, (items) => {
        const list = L.listOf(...items)
        expect(L.head(list)).toEqual(Some(items[0]))
      })
    )
  })
})

describe('tail()', () => {
  test('new empty lists have no tail', () => {
    const list = L.listOf()
    expect(L.tail(list)).toBe(None)
  })

  test('new non-empty lists have the last item provided as their tail', () => {
    fc.assert(
      fc.property(arbitraryNonEmptyArray, (items) => {
        const expectedValue = items[items.length - 1]
        const list = L.listOf(...items)
        expect(L.tail(list)).toEqual(Some(expectedValue))
      })
    )
  })
})

describe('prepend()', () => {
  test('prepending increases the length by 1', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const original = L.listOf(...items)
        const prepended = L.prepend('before', original)
        expect(L.length(prepended)).toEqual(L.length(original) + 1)
      })
    )
  })

  test('prepending to an empty list places the value at the head and the tail', () => {
    const list = L.prepend('value', L.listOf())
    expect(L.head(list)).toEqual(Some('value'))
    expect(L.tail(list)).toEqual(Some('value'))
  })

  test('prepending to a list places the value at the head', () => {
    const list = L.prepend('head value', L.prepend('tail value', L.listOf()))
    expect(L.head(list)).toEqual(Some('head value'))
  })

  test('prepending to a list keeps the tail unchanged', () => {
    const list = L.prepend('head value', L.prepend('tail value', L.listOf()))
    expect(L.tail(list)).toEqual(Some('tail value'))
  })
})

describe('append()', () => {
  test('appending to an empty list sets the length to 1', () => {
    const original = L.listOf()
    const appended = L.append('value', original)
    expect(L.length(appended)).toEqual(1)
  })

  test('appending to an empty list places the value at the head and the tail', () => {
    const list = L.append('value', L.listOf())
    expect(L.head(list)).toEqual(Some('value'))
    expect(L.tail(list)).toEqual(Some('value'))
  })

  test('appending to a list preserves the head', () => {
    const list = L.append('tail value', L.append('head value', L.listOf()))
    expect(L.head(list)).toEqual(Some('head value'))
  })

  test('appending to a list places value at the tail', () => {
    fc.assert(
      fc.property(arbitraryArray, fc.anything(), (items, item) => {
        const original = L.listOf(...items)
        expect(L.tail(L.append(item, original))).toEqual(Some(item))
      })
    )
  })
})

describe('reverse()', () => {
  test('reverses a linked list', () => {
    fc.assert(
      fc.property(arbitraryArray, (a) => {
        expect(L.reverse(L.listOf(...a))).toEqual(L.listOf(...a.reverse()))
      })
    )
  })

  test('inverse property', () => {
    fc.assert(
      fc.property(arbitraryArray, (a) => {
        const list = L.listOf(...a)
        expect(L.reverse(L.reverse(list))).toEqual(list)
      })
    )
  })
})

describe('concat()', () => {
  test('concatenation with null element', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        expect(L.concat(list, L.listOf())).toEqual(list)
      })
    )
  })

  test('distributivity', () => {
    fc.assert(
      fc.property(arbitraryArray, arbitraryArray, (a, b) => {
        expect(L.concat(L.listOf(...a), L.listOf(...b))).toEqual(
          L.listOf(...a, ...b)
        )
      })
    )
  })
})

describe('rest()', () => {
  test('returns the list with the head element removed', () => {
    fc.assert(
      fc.property(arbitraryArray, ([h, ...r]) => {
        expect(L.rest(L.listOf(h, ...r))).toEqual(L.listOf(...r))
      })
    )
  })
})

describe('filter()', () => {
  test('returns an empty list unchanged', () => {
    const emptyList = L.listOf()
    expect(L.filter(() => true, emptyList)).toEqual(emptyList)
  })

  test('calls the predicate function for every item in the list', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        const predicate = jest.fn()

        L.filter(predicate, list)

        expect(predicate).toHaveBeenCalledTimes(items.length)
        items.forEach((item, index) =>
          expect(predicate).toHaveBeenCalledWith(item, index, list)
        )
      })
    )
  })

  test('returns the full list when the predicate is true', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        const predicate = () => true
        expect(L.filter(predicate, list)).toEqual(list)
      })
    )
  })

  test('returns an empty list when the predicate is false', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        const predicate = () => false
        expect(L.filter(predicate, list)).toEqual(L.listOf())
      })
    )
  })
})

describe('map()', () => {
  test('returns an empty list unchanged', () => {
    const list = L.listOf()
    expect(L.map((i) => i, list)).toEqual(list)
  })

  test('calls the callback function for every item in the list', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        const callback = jest.fn()

        L.map(callback, list)

        expect(callback).toHaveBeenCalledTimes(items.length)
        items.forEach((item, index) =>
          expect(callback).toHaveBeenCalledWith(item, index, list)
        )
      })
    )
  })

  test('creates a new list with the items of the list transformed', () => {
    const callback = (i: number) => i + 1
    expect(L.map(callback, L.listOf(1, 2, 3))).toEqual(L.listOf(2, 3, 4))
  })
})

describe('flatMap()', () => {
  test('returns an empty list unchanged', () => {
    const list = L.listOf()
    expect(L.flatMap((i) => L.listOf(i), list)).toEqual(list)
  })

  test('calls the callback function for every item in the list', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        const callback = jest.fn()

        L.flatMap(callback, list)

        expect(callback).toHaveBeenCalledTimes(items.length)
        items.forEach((item, index) =>
          expect(callback).toHaveBeenCalledWith(item, index, list)
        )
      })
    )
  })

  test('linked list results are flattened', () => {
    const list = L.listOf(1, 2, 3)
    expect(L.flatMap((i) => L.listOf(i), list)).toEqual(list)
  })

  test('linked list results are flattened in the right order', () => {
    const list = L.listOf(1, 2, 3)
    const expected = L.listOf(1.1, 1.2, 2.1, 2.2, 3.1, 3.2)
    expect(L.flatMap((i) => L.listOf(i + 0.1, i + 0.2), list)).toEqual(expected)
  })
})

describe('reduce()', () => {
  test('returns the initial value for an empty list', () => {
    const list = L.listOf()
    expect(L.reduce(() => Infinity, 0, list)).toEqual(0)
  })

  test('calls the callback function for every item in the list', () => {
    const list = L.listOf(1, 2, 3)
    const callback = jest.fn((acc, i) => acc + i)

    L.reduce(callback, 0, list)

    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(0, 1, 0, list)
    expect(callback).toHaveBeenCalledWith(1, 2, 1, list)
    expect(callback).toHaveBeenCalledWith(3, 3, 2, list)
  })

  test('reduces the items in the list to a result', () => {
    const list = L.listOf(1, 2, 3)
    const actual = L.reduce((total, value) => total + value, 0, list)
    expect(actual).toEqual(6)
  })
})

describe('reduceRight()', () => {
  test('returns the initial value for an empty list', () => {
    const list = L.listOf()
    expect(L.reduceRight(() => Infinity, 0, list)).toEqual(0)
  })

  test('calls the callback function for every item in the list', () => {
    const list = L.listOf(1, 2, 3)
    const callback = jest.fn((acc, i) => acc + i)

    L.reduceRight(callback, 0, list)

    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(0, 3, 2, list)
    expect(callback).toHaveBeenCalledWith(3, 2, 1, list)
    expect(callback).toHaveBeenCalledWith(5, 1, 0, list)
  })

  test('reduces the items in the list to a result', () => {
    const list = L.listOf(1, 2, 3)
    const actual = L.reduceRight((total, value) => total + value, 0, list)
    expect(actual).toEqual(6)
  })
})
