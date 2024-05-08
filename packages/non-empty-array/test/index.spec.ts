import { describe, it, test, expect } from 'vitest'
import { anything, Arbitrary, array, assert, property, tuple } from 'fast-check'
import { Some, None } from '@pacote/option'
import { fromElements, fromArray, concat, isNonEmptyArray } from '../src/index'

describe('fromElements()', () => {
  it('creates non-empty array from a single element', () => {
    expect(fromElements(1)).toEqual([1])
  })

  it('creates non-empty array from multiple elements', () => {
    expect(fromElements(1, 2, 3)).toEqual([1, 2, 3])
  })
})

describe('fromArray()', () => {
  it('returns Some(array) if not empty', () => {
    expect(fromArray([1])).toEqual(Some([1]))
  })

  it('returns None if empty', () => {
    expect(fromArray([])).toEqual(None)
  })
})

describe('isNonEmptyArray()', () => {
  it('is true when the value is a non-empty array', () => {
    expect(isNonEmptyArray([1])).toBe(true)
  })

  it('is false when the value is an empty array', () => {
    expect(isNonEmptyArray([])).toBe(false)
  })

  it('is false when the value is not an array', () => {
    expect(isNonEmptyArray(undefined)).toBe(false)
  })
})

describe('semigroup laws', () => {
  function arbitraryNonEmptyArray<T>(arb: Arbitrary<T>) {
    return tuple(arb, array(arb)).map(([first, rest]) =>
      fromElements(first, ...rest),
    )
  }

  test('associativity', () => {
    assert(
      property(
        arbitraryNonEmptyArray(anything()),
        arbitraryNonEmptyArray(anything()),
        arbitraryNonEmptyArray(anything()),
        (a, b, c) => {
          expect(concat(concat(a, b), c)).toEqual(concat(a, concat(b, c)))
        },
      ),
    )
  })
})
