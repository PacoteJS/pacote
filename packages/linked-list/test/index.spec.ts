import {
  append,
  concat,
  entries,
  every,
  filter,
  find,
  get,
  head,
  includes,
  indexOf,
  isEmpty,
  keys,
  lastIndexOf,
  length,
  listOf,
  map,
  prepend,
  reduce,
  reduceRight,
  remove,
  rest,
  reverse,
  slice,
  some,
  sort,
  tail,
  toArray,
  values,
} from '../src/index'
import {
  assert,
  property,
  array,
  anything,
  integer,
  nat,
  string,
} from 'fast-check'

const arbitraryArray = array(anything())

describe('isEmpty()', () => {
  test('new empty lists are empty', () => {
    const list = listOf()
    expect(isEmpty(list)).toBe(true)
  })

  test('new non-empty lists are not empty', () => {
    const list = listOf('value')
    expect(isEmpty(list)).toBe(false)
  })
})

describe('length()', () => {
  test('new lists have a length equal to the items originally passed', () => {
    assert(
      property(arbitraryArray, (items) => {
        const list = listOf(...items)
        expect(length(list)).toEqual(items.length)
      })
    )
  })
})

describe('head()', () => {
  test('new empty lists have no head', () => {
    const list = listOf()
    expect(head(list)).toBe(undefined)
  })

  test('new lists have the first item provided as their head', () => {
    assert(
      property(arbitraryArray, (items) => {
        const list = listOf(...items)
        expect(head(list)).toEqual(items[0])
      })
    )
  })
})

describe('tail()', () => {
  test('new empty lists have no tail', () => {
    const list = listOf()
    expect(tail(list)).toBe(undefined)
  })

  test('new lists have the last item provided as their tail', () => {
    assert(
      property(arbitraryArray, (items) => {
        const list = listOf(...items)
        expect(tail(list)).toEqual(items[items.length - 1])
      })
    )
  })
})

describe('toArray()', () => {
  test('an empty linked list is converted to an empty array', () => {
    const list = listOf()
    expect(toArray(list)).toEqual([])
  })

  test('linked lists can be converted to and from arrays', () => {
    assert(
      property(arbitraryArray, (items) =>
        expect(toArray(listOf(...items))).toEqual(items)
      )
    )
  })
})

describe('prepend()', () => {
  test('prepending increases the length by 1', () => {
    assert(
      property(arbitraryArray, (items) => {
        const original = listOf(...items)
        const prepended = prepend('before', original)
        expect(length(prepended)).toEqual(length(original) + 1)
      })
    )
  })

  test('prepending to an empty list places the value at the head and the tail', () => {
    const list = prepend('value', listOf())
    expect(head(list)).toEqual('value')
    expect(tail(list)).toEqual('value')
  })

  test('prepending to a list places the value at the head', () => {
    const list = prepend('head value', prepend('tail value', listOf()))
    expect(head(list)).toEqual('head value')
  })

  test('prepending to a list keeps the tail unchanged', () => {
    const list = prepend('head value', prepend('tail value', listOf()))
    expect(tail(list)).toEqual('tail value')
  })
})

describe('append()', () => {
  test('appending to an empty list sets the length to 1', () => {
    const original = listOf()
    const appended = append('value', original)
    expect(length(appended)).toEqual(1)
  })

  test('appending to an empty list places the value at the head and the tail', () => {
    const list = append('value', listOf())
    expect(head(list)).toEqual('value')
    expect(tail(list)).toEqual('value')
  })

  test('appending to a list preserves the head', () => {
    const list = append('tail value', append('head value', listOf()))
    expect(head(list)).toEqual('head value')
  })

  test('appending to a list places value at the tail', () => {
    assert(
      property(arbitraryArray, anything(), (items, item) => {
        const original = listOf(...items)
        expect(tail(append(item, original))).toEqual(item)
      })
    )
  })
})

describe('reverse()', () => {
  test('reverses a linked list', () => {
    assert(
      property(arbitraryArray, (a) => {
        expect(reverse(listOf(...a))).toEqual(listOf(...a.reverse()))
      })
    )
  })

  test('inverse property', () => {
    assert(
      property(arbitraryArray, (a) => {
        const list = listOf(...a)
        expect(reverse(reverse(list))).toEqual(list)
      })
    )
  })
})

describe('concat()', () => {
  test('concatenation with null element', () => {
    assert(
      property(arbitraryArray, (items) => {
        const list = listOf(...items)
        expect(concat(list, listOf())).toEqual(list)
      })
    )
  })

  test('distributivity', () => {
    assert(
      property(arbitraryArray, arbitraryArray, (a, b) => {
        expect(concat(listOf(...a), listOf(...b))).toEqual(listOf(...a, ...b))
      })
    )
  })
})

describe('rest()', () => {
  test('returns the list with the head element removed', () => {
    assert(
      property(arbitraryArray, ([h, ...r]) => {
        expect(rest(listOf(h, ...r))).toEqual(listOf(...r))
      })
    )
  })
})

describe('filter()', () => {
  test('returns an empty list unchanged', () => {
    const emptyList = listOf()
    expect(filter(() => true, emptyList)).toEqual(emptyList)
  })

  test('calls the predicate function for every item in the list', () => {
    assert(
      property(arbitraryArray, (items) => {
        const list = listOf(...items)
        const predicate = jest.fn()

        filter(predicate, list)

        expect(predicate).toHaveBeenCalledTimes(items.length)
        items.forEach((item, index) =>
          expect(predicate).toHaveBeenCalledWith(item, index, list)
        )
      })
    )
  })

  test('returns the full list when the predicate is true', () => {
    assert(
      property(arbitraryArray, (items) => {
        const list = listOf(...items)
        const predicate = () => true
        expect(filter(predicate, list)).toEqual(list)
      })
    )
  })

  test('returns an empty list when the predicate is false', () => {
    assert(
      property(arbitraryArray, (items) => {
        const list = listOf(...items)
        const predicate = () => false
        expect(filter(predicate, list)).toEqual(listOf())
      })
    )
  })
})

describe('map()', () => {
  test('returns an empty list unchanged', () => {
    const list = listOf()
    expect(map((i) => i, list)).toEqual(list)
  })

  test('calls the mapper function for every item in the list', () => {
    assert(
      property(arbitraryArray, (items) => {
        const list = listOf(...items)
        const mapper = jest.fn()

        map(mapper, list)

        expect(mapper).toHaveBeenCalledTimes(items.length)
        items.forEach((item, index) =>
          expect(mapper).toHaveBeenCalledWith(item, index, list)
        )
      })
    )
  })

  test('creates a new list with the items of the list transformed', () => {
    const mapper = (i: number) => i + 1
    expect(map(mapper, listOf(1, 2, 3))).toEqual(listOf(2, 3, 4))
  })
})

describe('reduce()', () => {
  test('returns the initial value for an empty list', () => {
    const list = listOf<number>()
    expect(reduce((acc, i) => acc + i, 0, list)).toEqual(0)
  })

  test('calls the reducer function for every item in the list', () => {
    const list = listOf(1, 2, 3)
    const reducer = jest.fn((acc, i) => acc + i)

    reduce(reducer, 0, list)

    expect(reducer).toHaveBeenCalledTimes(3)
    expect(reducer).toHaveBeenCalledWith(0, 1, 0, list)
    expect(reducer).toHaveBeenCalledWith(1, 2, 1, list)
    expect(reducer).toHaveBeenCalledWith(3, 3, 2, list)
  })

  test('reduces the items in the list to a result', () => {
    const list = listOf(1, 2, 3)
    const actual = reduce((total, value) => total + value, 0, list)
    expect(actual).toEqual(6)
  })
})

describe('reduceRight()', () => {
  test('returns the initial value for an empty list', () => {
    const list = listOf<number>()
    expect(reduceRight((acc, i) => acc + i, 0, list)).toEqual(0)
  })

  test('calls the reducer function for every item in the list', () => {
    const list = listOf(1, 2, 3)
    const reducer = jest.fn((acc, i) => acc + i)

    reduceRight(reducer, 0, list)

    expect(reducer).toHaveBeenCalledTimes(3)
    expect(reducer).toHaveBeenCalledWith(0, 3, 2, list)
    expect(reducer).toHaveBeenCalledWith(3, 2, 1, list)
    expect(reducer).toHaveBeenCalledWith(5, 1, 0, list)
  })

  test('reduces the items in the list to a result', () => {
    const list = listOf(1, 2, 3)
    const actual = reduceRight((total, value) => total + value, 0, list)
    expect(actual).toEqual(6)
  })
})

describe('find()', () => {
  test('returns undefined if the list is empty', () => {
    const emptyList = listOf()
    expect(find(() => true, emptyList)).toEqual(undefined)
  })

  test('returns the first item of the list when the predicate is true', () => {
    assert(
      property(arbitraryArray, ([first, ...remaining]) => {
        const list = listOf(first, ...remaining)
        const predicate = () => true
        expect(find(predicate, list)).toEqual(first)
      })
    )
  })

  test('returns undefined when the predicate is false', () => {
    assert(
      property(arbitraryArray, (items) => {
        const list = listOf(...items)
        const predicate = () => false
        expect(find(predicate, list)).toEqual(undefined)
      })
    )
  })

  test("calls the predicate function for every item in the list until it's satisfied", () => {
    const list = listOf(1, 2, 3)
    const predicate = jest.fn((i) => i === 2)

    const actual = find(predicate, list)

    expect(predicate).toHaveBeenCalledTimes(2)
    expect(predicate).toHaveBeenCalledWith(1, 0, list)
    expect(predicate).toHaveBeenCalledWith(2, 1, list)

    expect(actual).toEqual(2)
  })
})

describe('entries()', () => {
  test('iterator is done for empty lists', () => {
    const list = listOf()
    const iterator = entries(list)

    expect(iterator.next().done).toEqual(true)
  })

  test('iterator holds undefined value for empty lists', () => {
    const list = listOf()
    const iterator = entries(list)

    expect(iterator.next().value).toEqual(undefined)
  })

  test('iterator is not done at the start of non-empty lists', () => {
    const list = listOf('value')
    const iterator = entries(list)

    expect(iterator.next().done).toEqual(false)
  })

  test('iterator holds the head value at the start of non-empty lists', () => {
    const list = listOf('value')
    const iterator = entries(list)

    expect(iterator.next().value).toEqual([0, 'value'])
  })

  test('iterator can iterate over multiple items', () => {
    const list = listOf('first', 'second')
    const iterator = entries(list)

    expect(iterator.next().value).toEqual([0, 'first'])
    expect(iterator.next().value).toEqual([1, 'second'])
    expect(iterator.next().done).toEqual(true)
  })
})

describe('keys()', () => {
  test('iterator is done for empty lists', () => {
    const list = listOf()
    const iterator = keys(list)

    expect(iterator.next().done).toEqual(true)
  })

  test('iterator holds undefined value for empty lists', () => {
    const list = listOf()
    const iterator = keys(list)

    expect(iterator.next().value).toEqual(undefined)
  })

  test('iterator is not done at the start of non-empty lists', () => {
    const list = listOf('value')
    const iterator = keys(list)

    expect(iterator.next().done).toEqual(false)
  })

  test('iterator holds the head value at the start of non-empty lists', () => {
    const list = listOf('value')
    const iterator = keys(list)

    expect(iterator.next().value).toEqual(0)
  })

  test('iterator can iterate over multiple items', () => {
    const list = listOf('first', 'second')
    const iterator = keys(list)

    expect(iterator.next().value).toEqual(0)
    expect(iterator.next().value).toEqual(1)
    expect(iterator.next().done).toEqual(true)
  })
})

describe('values()', () => {
  test('iterator is done for empty lists', () => {
    const list = listOf()
    const iterator = values(list)

    expect(iterator.next().done).toEqual(true)
  })

  test('iterator holds undefined value for empty lists', () => {
    const list = listOf()
    const iterator = values(list)

    expect(iterator.next().value).toEqual(undefined)
  })

  test('iterator is not done at the start of non-empty lists', () => {
    const list = listOf('value')
    const iterator = values(list)

    expect(iterator.next().done).toEqual(false)
  })

  test('iterator holds the head value at the start of non-empty lists', () => {
    const list = listOf('value')
    const iterator = values(list)

    expect(iterator.next().value).toEqual('value')
  })

  test('iterator can iterate over multiple items', () => {
    const list = listOf('first', 'second')
    const iterator = values(list)

    expect(iterator.next().value).toEqual('first')
    expect(iterator.next().value).toEqual('second')
    expect(iterator.next().done).toEqual(true)
  })
})

describe('indexOf()', () => {
  test("returns -1 when the value can't be found", () => {
    const list = listOf()
    expect(indexOf('value', list)).toBe(-1)
  })

  test('returns 0 when the value is found at the head', () => {
    const list = listOf('value')
    expect(indexOf('value', list)).toBe(0)
  })

  test('returns the last index when the value is found at the tail', () => {
    const list = listOf('first', 'second', 'value')
    expect(indexOf('value', list)).toBe(2)
  })

  test('returns the index of the value when found', () => {
    const list = listOf('first', 'value', 'value', 'third')
    expect(indexOf('value', list)).toBe(1)
  })
})

describe('lastIndexOf()', () => {
  test("returns -1 when the value can't be found", () => {
    const list = listOf()
    expect(lastIndexOf('value', list)).toBe(-1)
  })

  test('returns 0 when the value is found at the head', () => {
    const list = listOf('value')
    expect(lastIndexOf('value', list)).toBe(0)
  })

  test('returns the last index when the value is found at the tail', () => {
    const list = listOf('first', 'second', 'value')
    expect(lastIndexOf('value', list)).toBe(2)
  })

  test('returns the index of the first value from the right', () => {
    const list = listOf('first', 'value', 'value', 'third')
    expect(lastIndexOf('value', list)).toBe(2)
  })
})

describe('get()', () => {
  test('returns undefined for negative indices', () => {
    assert(
      property(integer(-1), arbitraryArray, (index, array) => {
        const list = listOf(...array)
        expect(get(index, list)).toEqual(undefined)
      })
    )
  })

  test('returns the value at index', () => {
    assert(
      property(arbitraryArray, nat(), (array, index) => {
        const list = listOf(...array)
        expect(get(index, list)).toEqual(array[index])
      })
    )
  })
})

describe('remove()', () => {
  test('returns the list unchanged if empty', () => {
    const list = listOf()
    expect(remove(0, list)).toEqual(list)
  })

  test('returns an empty list if the list has a single element', () => {
    const list = listOf(1)
    const emptyList = listOf()
    expect(remove(0, list)).toEqual(emptyList)
  })

  test('removes an element from the middle of the list', () => {
    const list = listOf(1, 2, 3, 4, 5)
    const expected = listOf(1, 2, 4, 5)
    expect(remove(2, list)).toEqual(expected)
  })

  test('an invalid index leaves the list unchanged', () => {
    const list = listOf(1, 2, 3)
    expect(remove(99, list)).toEqual(list)
  })
})

describe('slice()', () => {
  test('any slice of an empty list is an empty list', () => {
    const emptyList = listOf()
    expect(slice(0, 1, emptyList)).toEqual(emptyList)
  })

  test('slicing a list between two indices', () => {
    const list = listOf(1, 2, 3, 4)
    const expected = listOf(2, 3)
    expect(slice(1, 3, list)).toEqual(expected)
  })

  test('slicing before the start of the list returns the list from the start', () => {
    const list = listOf(1, 2, 3, 4)
    const expected = listOf(1, 2)
    expect(slice(-1, 2, list)).toEqual(expected)
  })

  test('slicing past the end of the list returns the list until the end', () => {
    const list = listOf(1, 2, 3, 4)
    const expected = listOf(3, 4)
    expect(slice(2, 5, list)).toEqual(expected)
  })

  test('an exact slice returns the full list', () => {
    const list = listOf(1, 2, 3, 4)
    expect(slice(0, 4, list)).toEqual(list)
  })

  test.todo('a list can be sliced from a starting index')
})

describe('every()', () => {
  test('returns true for empty lists', () => {
    const list = listOf()
    expect(every(() => true, list)).toEqual(true)
  })

  test('returns false when predicate is false for at least one item', () => {
    const list = listOf(1, 2)
    expect(every((value) => value < 2, list)).toEqual(false)
  })

  test('predicate is called for every item until the predicate fails', () => {
    const list = listOf(1, 2, 3)
    const predicate = jest.fn((value) => value < 2)

    every(predicate, list)

    expect(predicate).toHaveBeenCalledTimes(2)
    expect(predicate).toHaveBeenCalledWith(1, 0, list)
    expect(predicate).toHaveBeenCalledWith(2, 1, list)
  })
})

describe('some()', () => {
  test('returns false for empty lists', () => {
    const list = listOf()
    expect(some(() => true, list)).toEqual(false)
  })

  test('returns true when predicate is true for at least one item', () => {
    const list = listOf(1, 2)
    expect(some((value) => value > 1, list)).toEqual(true)
  })

  test('predicate is called for every item until the predicate succeeds', () => {
    const list = listOf(1, 2, 3)
    const predicate = jest.fn((value) => value > 1)

    some(predicate, list)

    expect(predicate).toHaveBeenCalledTimes(2)
    expect(predicate).toHaveBeenCalledWith(1, 0, list)
    expect(predicate).toHaveBeenCalledWith(2, 1, list)
  })
})

describe('includes()', () => {
  test('returns false for empty lists', () => {
    const list = listOf<string>()
    expect(includes('value', list)).toEqual(false)
  })

  test('returns true when the list includes the item', () => {
    const list = listOf('first', 'second')
    expect(includes('value', list)).toEqual(false)
  })

  test('returns false when the list does not include the item', () => {
    const list = listOf('first', 'second', 'value')
    expect(includes('value', list)).toEqual(true)
  })
})

describe('sort()', () => {
  test('empty lists are already sorted', () => {
    const list = listOf()
    const expected = listOf()
    expect(sort(list)).toEqual(expected)
  })

  test('single-item lists are already sorted', () => {
    const list = listOf('a')
    const expected = listOf('a')
    expect(sort(list)).toEqual(expected)
  })

  test('sorting out of order lists with the default compare function', () => {
    const list = listOf('b', 'a')
    const expected = listOf('a', 'b')
    expect(sort(list)).toEqual(expected)
  })

  test('the default compare function sorts numbers alphabetically', () => {
    const list = listOf(9, 80)
    const expected = listOf(80, 9)
    expect(sort(list)).toEqual(expected)
  })

  test('the default compare function sorts undefined items at the end', () => {
    const list = listOf(undefined, 1)
    const expected = listOf(1, undefined)
    expect(sort(list)).toEqual(expected)
  })

  test('sort with compare function', () => {
    const list = listOf(9, 80)
    const expected = listOf(9, 80)
    const compareFn = jest.fn((a, b) => a - b)
    expect(sort(compareFn, list)).toEqual(expected)
  })

  test('sort stability', () => {
    const list = listOf({ weight: 1, order: 1 }, { weight: 1, order: 2 })
    const compareFn = jest.fn((a, b) => a.weight - b.weight)
    expect(sort(compareFn, list)).toEqual(list)
  })

  test('sort preserves length', () => {
    assert(
      property(array(string()), (strings) => {
        const list = listOf(...strings)
        expect(length(sort(list))).toEqual(length(list))
      })
    )
  })

  test('sort is idempotent', () => {
    assert(
      property(array(string()), (strings) => {
        const list = listOf(...strings)
        expect(sort(sort(list))).toEqual(sort(list))
      })
    )
  })

  test('Array#sort comparison', () => {
    assert(
      property(arbitraryArray, (array) => {
        const list = listOf(...array)
        expect(sort(list)).toEqual(listOf(...array.sort()))
      })
    )
  })
})
