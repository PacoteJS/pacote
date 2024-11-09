import { expect, describe, test } from 'vitest'
import { sample, sampleN } from '../src/index'
import { array, assert, integer, nat, property } from 'fast-check'

describe('sample', () => {
  test('undefined if the array is empty', () => {
    expect(sample([])).toBeUndefined()
  })

  test('pick a random element from a single-item array', () => {
    expect(sample([1])).toEqual(1)
  })

  test('pick a random element from a multi-item array', () => {
    assert(
      property(array(nat(), { minLength: 1 }), (collection) => {
        const actual = sample(collection)
        expect(collection).toContain(actual)
      }),
    )
  })
})

describe('sampleN', () => {
  test('empty result if the array is empty', () => {
    assert(
      property(nat(), (sampleSize) => {
        const actual = sampleN([], sampleSize)
        expect(actual).toEqual([])
      }),
    )
  })

  test('empty result if the sample size is 0', () => {
    assert(
      property(array(nat()), (collection) => {
        const actual = sampleN(collection, 0)
        expect(actual).toEqual([])
      }),
    )
  })

  test('empty result if the sample size is non-positive', () => {
    assert(
      property(
        array(nat()),
        integer({ min: -1000, max: 0 }),
        (collection, sampleSize) => {
          const actual = sampleN(collection, sampleSize)
          expect(actual).toEqual([])
        },
      ),
    )
  })

  test('picks n items from the array', () => {
    assert(
      property(array(nat()), nat(), (collection, n) => {
        const actual = sampleN(collection, n)
        expect(actual).toHaveLength(n)
      }),
    )
  })
})
