import * as L from '../src/index'
import * as fc from 'fast-check'

const [V8_VERSION_MAJOR] = process.versions.v8.split('.')

const arbitraryArray = fc.array(fc.anything())

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
  test('new lists have a length equal to the items originally passed', () => {
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
    expect(L.head(list)).toBe(undefined)
  })

  test('new lists have the first item provided as their head', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        expect(L.head(list)).toEqual(items[0])
      })
    )
  })
})

describe('tail()', () => {
  test('new empty lists have no tail', () => {
    const list = L.listOf()
    expect(L.tail(list)).toBe(undefined)
  })

  test('new lists have the last item provided as their tail', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        expect(L.tail(list)).toEqual(items[items.length - 1])
      })
    )
  })
})

describe('toArray()', () => {
  test('an empty linked list is converted to an empty array', () => {
    const list = L.listOf()
    expect(L.toArray(list)).toEqual([])
  })

  test('linked lists can be converted to and from arrays', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) =>
        expect(L.toArray(L.listOf(...items))).toEqual(items)
      )
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
    expect(L.head(list)).toEqual('value')
    expect(L.tail(list)).toEqual('value')
  })

  test('prepending to a list places the value at the head', () => {
    const list = L.prepend('head value', L.prepend('tail value', L.listOf()))
    expect(L.head(list)).toEqual('head value')
  })

  test('prepending to a list keeps the tail unchanged', () => {
    const list = L.prepend('head value', L.prepend('tail value', L.listOf()))
    expect(L.tail(list)).toEqual('tail value')
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
    expect(L.head(list)).toEqual('value')
    expect(L.tail(list)).toEqual('value')
  })

  test('appending to a list preserves the head', () => {
    const list = L.append('tail value', L.append('head value', L.listOf()))
    expect(L.head(list)).toEqual('head value')
  })

  test('appending to a list places value at the tail', () => {
    fc.assert(
      fc.property(arbitraryArray, fc.anything(), (items, item) => {
        const original = L.listOf(...items)
        expect(L.tail(L.append(item, original))).toEqual(item)
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

  test('calls the mapper function for every item in the list', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        const mapper = jest.fn()

        L.map(mapper, list)

        expect(mapper).toHaveBeenCalledTimes(items.length)
        items.forEach((item, index) =>
          expect(mapper).toHaveBeenCalledWith(item, index, list)
        )
      })
    )
  })

  test('creates a new list with the items of the list transformed', () => {
    const mapper = (i: number) => i + 1
    expect(L.map(mapper, L.listOf(1, 2, 3))).toEqual(L.listOf(2, 3, 4))
  })
})

describe('reduce()', () => {
  test('returns the initial value for an empty list', () => {
    const list = L.listOf()
    expect(L.reduce(() => Infinity, 0, list)).toEqual(0)
  })

  test('calls the reducer function for every item in the list', () => {
    const list = L.listOf(1, 2, 3)
    const reducer = jest.fn((acc, i) => acc + i)

    L.reduce(reducer, 0, list)

    expect(reducer).toHaveBeenCalledTimes(3)
    expect(reducer).toHaveBeenCalledWith(0, 1, 0, list)
    expect(reducer).toHaveBeenCalledWith(1, 2, 1, list)
    expect(reducer).toHaveBeenCalledWith(3, 3, 2, list)
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

  test('calls the reducer function for every item in the list', () => {
    const list = L.listOf(1, 2, 3)
    const reducer = jest.fn((acc, i) => acc + i)

    L.reduceRight(reducer, 0, list)

    expect(reducer).toHaveBeenCalledTimes(3)
    expect(reducer).toHaveBeenCalledWith(0, 3, 2, list)
    expect(reducer).toHaveBeenCalledWith(3, 2, 1, list)
    expect(reducer).toHaveBeenCalledWith(5, 1, 0, list)
  })

  test('reduces the items in the list to a result', () => {
    const list = L.listOf(1, 2, 3)
    const actual = L.reduceRight((total, value) => total + value, 0, list)
    expect(actual).toEqual(6)
  })
})

describe('find()', () => {
  test('returns undefined if the list is empty', () => {
    const emptyList = L.listOf()
    expect(L.find(() => true, emptyList)).toEqual(undefined)
  })

  test('returns the first item of the list when the predicate is true', () => {
    fc.assert(
      fc.property(arbitraryArray, ([first, ...remaining]) => {
        const list = L.listOf(first, ...remaining)
        const predicate = () => true
        expect(L.find(predicate, list)).toEqual(first)
      })
    )
  })

  test('returns undefined when the predicate is false', () => {
    fc.assert(
      fc.property(arbitraryArray, (items) => {
        const list = L.listOf(...items)
        const predicate = () => false
        expect(L.find(predicate, list)).toEqual(undefined)
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

    expect(actual).toEqual(2)
  })
})

describe('entries()', () => {
  test('iterator is done for empty lists', () => {
    const list = L.listOf()
    const iterator = L.entries(list)

    expect(iterator.next().done).toEqual(true)
  })

  test('iterator holds undefined value for empty lists', () => {
    const list = L.listOf()
    const iterator = L.entries(list)

    expect(iterator.next().value).toEqual(undefined)
  })

  test('iterator is not done at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.entries(list)

    expect(iterator.next().done).toEqual(false)
  })

  test('iterator holds the head value at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.entries(list)

    expect(iterator.next().value).toEqual([0, 'value'])
  })

  test('iterator can iterate over multiple items', () => {
    const list = L.listOf('first', 'second')
    const iterator = L.entries(list)

    expect(iterator.next().value).toEqual([0, 'first'])
    expect(iterator.next().value).toEqual([1, 'second'])
    expect(iterator.next().done).toEqual(true)
  })
})

describe('keys()', () => {
  test('iterator is done for empty lists', () => {
    const list = L.listOf()
    const iterator = L.keys(list)

    expect(iterator.next().done).toEqual(true)
  })

  test('iterator holds undefined value for empty lists', () => {
    const list = L.listOf()
    const iterator = L.keys(list)

    expect(iterator.next().value).toEqual(undefined)
  })

  test('iterator is not done at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.keys(list)

    expect(iterator.next().done).toEqual(false)
  })

  test('iterator holds the head value at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.keys(list)

    expect(iterator.next().value).toEqual(0)
  })

  test('iterator can iterate over multiple items', () => {
    const list = L.listOf('first', 'second')
    const iterator = L.keys(list)

    expect(iterator.next().value).toEqual(0)
    expect(iterator.next().value).toEqual(1)
    expect(iterator.next().done).toEqual(true)
  })
})

describe('values()', () => {
  test('iterator is done for empty lists', () => {
    const list = L.listOf()
    const iterator = L.values(list)

    expect(iterator.next().done).toEqual(true)
  })

  test('iterator holds undefined value for empty lists', () => {
    const list = L.listOf()
    const iterator = L.values(list)

    expect(iterator.next().value).toEqual(undefined)
  })

  test('iterator is not done at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.values(list)

    expect(iterator.next().done).toEqual(false)
  })

  test('iterator holds the head value at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.values(list)

    expect(iterator.next().value).toEqual('value')
  })

  test('iterator can iterate over multiple items', () => {
    const list = L.listOf('first', 'second')
    const iterator = L.values(list)

    expect(iterator.next().value).toEqual('first')
    expect(iterator.next().value).toEqual('second')
    expect(iterator.next().done).toEqual(true)
  })
})

describe('indexOf()', () => {
  test("returns -1 when the value can't be found", () => {
    const list = L.listOf()
    expect(L.indexOf('value', list)).toBe(-1)
  })

  test('returns 0 when the value is found at the head', () => {
    const list = L.listOf('value')
    expect(L.indexOf('value', list)).toBe(0)
  })

  test('returns the last index when the value is found at the tail', () => {
    const list = L.listOf('first', 'second', 'value')
    expect(L.indexOf('value', list)).toBe(2)
  })

  test('returns the index of the value when found', () => {
    const list = L.listOf('first', 'value', 'value', 'third')
    expect(L.indexOf('value', list)).toBe(1)
  })
})

describe('lastIndexOf()', () => {
  test("returns -1 when the value can't be found", () => {
    const list = L.listOf()
    expect(L.lastIndexOf('value', list)).toBe(-1)
  })

  test('returns 0 when the value is found at the head', () => {
    const list = L.listOf('value')
    expect(L.lastIndexOf('value', list)).toBe(0)
  })

  test('returns the last index when the value is found at the tail', () => {
    const list = L.listOf('first', 'second', 'value')
    expect(L.lastIndexOf('value', list)).toBe(2)
  })

  test('returns the index of the first value from the right', () => {
    const list = L.listOf('first', 'value', 'value', 'third')
    expect(L.lastIndexOf('value', list)).toBe(2)
  })
})

describe('get()', () => {
  test('returns undefined for negative indices', () => {
    fc.assert(
      fc.property(fc.integer(-1), arbitraryArray, (index, array) => {
        const list = L.listOf(...array)
        expect(L.get(index, list)).toEqual(undefined)
      })
    )
  })

  test('returns the value at index', () => {
    fc.assert(
      fc.property(arbitraryArray, fc.nat(), (array, index) => {
        const list = L.listOf(...array)
        expect(L.get(index, list)).toEqual(array[index])
      })
    )
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

describe('sort()', () => {
  test('empty lists are already sorted', () => {
    const list = L.listOf()
    const expected = L.listOf()
    expect(L.sort(list)).toEqual(expected)
  })

  test('single-item lists are already sorted', () => {
    const list = L.listOf('a')
    const expected = L.listOf('a')
    expect(L.sort(list)).toEqual(expected)
  })

  test('sorting out of order lists with the default compare function', () => {
    const list = L.listOf('b', 'a')
    const expected = L.listOf('a', 'b')
    expect(L.sort(list)).toEqual(expected)
  })

  test('the default compare function sorts numbers alphabetically', () => {
    const list = L.listOf(9, 80)
    const expected = L.listOf(80, 9)
    expect(L.sort(list)).toEqual(expected)
  })

  test('the default compare function puts undefined at the end', () => {
    const list = L.listOf(undefined, 'v')
    const expected = L.listOf('v', undefined)
    expect(L.sort(list)).toEqual(expected)
  })

  test('the default compare function keeps undefined at the end', () => {
    const list = L.listOf('v', undefined)
    const expected = L.listOf('v', undefined)
    expect(L.sort(list)).toEqual(expected)
  })

  test('sort with custom compare function', () => {
    const list = L.listOf(9, 80)
    const expected = L.listOf(9, 80)
    expect(L.sort((a, b) => a - b, list)).toEqual(expected)
  })

  test('sort stability', () => {
    const list = L.listOf([1, 1], [2, 3], [1, 2])
    const expected = L.listOf([1, 1], [1, 2], [2, 3])
    expect(L.sort(([a0], [b0]) => a0 - b0, list)).toEqual(expected)
  })

  test('sort preserves length', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (strings) => {
        const list = L.listOf(...strings)
        expect(L.length(L.sort(list))).toEqual(L.length(list))
      })
    )
  })

  test('sort is idempotent', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (strings) => {
        const list = L.listOf(...strings)
        expect(L.sort(L.sort(list))).toEqual(L.sort(list))
      })
    )
  })

  if (parseInt(V8_VERSION_MAJOR, 10) >= 7) {
    test('Array#sort comparison (stable on V8 7.0+)', () => {
      fc.assert(
        fc.property(arbitraryArray, (array) => {
          const list = L.listOf(...array)
          const sortedItems = array.sort()
          expect(L.sort(list)).toEqual(L.listOf(...sortedItems))
        })
      )
    })
  }
})
