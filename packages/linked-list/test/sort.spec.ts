import * as fc from 'fast-check'
import * as L from '../src/index'

const [V8_VERSION_MAJOR] = process.versions.v8.split('.')

const arbitraryArray = fc.array(fc.anything())

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
