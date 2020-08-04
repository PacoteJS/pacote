import {
  listOf,
  length,
  head,
  tail,
  toArray,
  prepend,
  append,
  concat,
  reverse,
  rest,
  filter,
  map,
  reduce,
  find,
} from '../src/index'
import { assert, property, array, anything, nat } from 'fast-check'

describe('listOf()', () => {
  test('new lists have no length', () => {
    const list = listOf()
    expect(length(list)).toBe(0)
  })

  test('new lists have no head', () => {
    const list = listOf()
    expect(head(list)).toBe(undefined)
  })

  test('new lists have no tail', () => {
    const list = listOf()
    expect(tail(list)).toBe(undefined)
  })
})

describe('toArray()', () => {
  test('an empty linked list is converted to an empty array', () => {
    const list = listOf()
    expect(toArray(list)).toEqual([])
  })

  test('linked lists can be converted to and from arrays', () => {
    assert(
      property(array(anything()), (items) =>
        expect(toArray(listOf(...items))).toEqual(items)
      )
    )
  })
})

describe('prepend()', () => {
  test('prepending increases the length by 1', () => {
    assert(
      property(array(anything()), (items) => {
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
      property(array(anything()), anything(), (items, item) => {
        const original = listOf(...items)
        expect(append(item, original)).toEqual(listOf(...items, item))
      })
    )
  })
})

describe('reverse()', () => {
  test('reverses a linked list', () => {
    assert(
      property(array(anything()), (a) => {
        expect(reverse(listOf(...a))).toEqual(listOf(...a.reverse()))
      })
    )
  })

  test('inverse property', () => {
    assert(
      property(array(anything()), (a) => {
        const list = listOf(...a)
        expect(reverse(reverse(list))).toEqual(list)
      })
    )
  })
})

describe('concat()', () => {
  test('concatenation with null element', () => {
    assert(
      property(array(anything()), (items) => {
        const list = listOf(...items)
        expect(concat(list, listOf())).toEqual(list)
      })
    )
  })

  test('distributivity', () => {
    assert(
      property(array(anything()), array(anything()), (a, b) => {
        expect(concat(listOf(...a), listOf(...b))).toEqual(listOf(...a, ...b))
      })
    )
  })
})

describe('rest()', () => {
  test('returns the list with the head element removed', () => {
    assert(
      property(array(anything()), ([h, ...r]) => {
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
      property(array(anything()), (items) => {
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
      property(array(anything()), (items) => {
        const list = listOf(...items)
        const predicate = () => true
        expect(filter(predicate, list)).toEqual(list)
      })
    )
  })

  test('returns an empty list when the predicate is false', () => {
    assert(
      property(array(anything()), (items) => {
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
      property(array(anything()), (items) => {
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
    const mapper = (i: number) => `${i + 1}`

    assert(
      property(array(nat()), (items) => {
        const actual = map(mapper, listOf(...items))
        const expected = listOf(...items.map(mapper))
        expect(actual).toEqual(expected)
      })
    )
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

describe('find()', () => {
  test('returns undefined if the list is empty', () => {
    const emptyList = listOf()
    expect(find(() => true, emptyList)).toEqual(undefined)
  })

  test('returns the first item of the list when the predicate is true', () => {
    assert(
      property(array(anything()), ([first, ...remaining]) => {
        const list = listOf(first, ...remaining)
        const predicate = () => true
        expect(find(predicate, list)).toEqual(first)
      })
    )
  })

  test('returns undefined when the predicate is false', () => {
    assert(
      property(array(anything()), (items) => {
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

test.todo('reduceRight()')
test.todo('sort()')
