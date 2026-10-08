import { times } from '@pacote/array'
import { assert, nat, property, string } from 'fast-check'
import { expect, test } from 'vitest'
import { CountingBloomFilter } from '../src/index'

test('a counting Bloom filter is empty when created', () => {
  assert(
    property(string(), (text) => {
      const filter = new CountingBloomFilter({ size: 34, hashes: 1 })
      expect(filter.has(text)).toBe(0)
    }),
    { numRuns: 10 },
  )
})

test('elements added to a counting Bloom filter can be found', () => {
  assert(
    property(string(), (element) => {
      const filter = new CountingBloomFilter({ size: 68, hashes: 1 })
      filter.add(element)
      expect(filter.has(element)).toBe(1)
    }),
    { numRuns: 10 },
  )
})

test('searching an element returns the number of times the element was added to the counting Bloom filter', () => {
  assert(
    property(string(), nat(100), (element, n) => {
      const filter = new CountingBloomFilter({ size: 68, hashes: 1 })
      times(n, () => filter.add(element))
      expect(filter.has(element)).toBe(n)
    }),
    { numRuns: 10 },
  )
})

test('elements can be removed from the counting Bloom filter', () => {
  assert(
    property(string(), (element) => {
      const filter = new CountingBloomFilter({ size: 68, hashes: 1 })
      filter.add(element)
      filter.add(element)
      filter.remove(element)
      expect(filter.has(element)).toBe(1)
    }),
    { numRuns: 10 },
  )
})

test('removing elements from a counting Bloom filter does not decrement the counters below 0', () => {
  assert(
    property(string(), (element) => {
      const filter = new CountingBloomFilter({ size: 68, hashes: 1 })
      filter.remove(element)
      expect(filter.has(element)).toBe(0)
    }),
    { numRuns: 10 },
  )
})

test('elements missing from a counting Bloom filter cannot be found', () => {
  const filter = new CountingBloomFilter({ size: 68, hashes: 1 })
  filter.add('foo')
  filter.add('bar')
  expect(filter.has('baz')).toBe(0)
})

test.each([0, 34.5, Number.NaN])(
  'counting Bloom filter size must be a positive integer, not %d',
  (size) => {
    expect(() => new CountingBloomFilter({ size, hashes: 1 })).toThrow(
      'size must be a positive integer',
    )
  },
)

test.each([0, 1.5, Number.NaN])(
  'counting Bloom filters require a positive integer number of hashes, not %d',
  (hashes) => {
    expect(() => new CountingBloomFilter({ size: 34, hashes })).toThrow(
      'number of hashes must be a positive integer',
    )
  },
)

test.each([[[0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0]]])(
  'counting Bloom filters cannot be restored from counters of the wrong length',
  (filter) => {
    expect(
      () => new CountingBloomFilter({ size: 5, hashes: 1, filter }),
    ).toThrow('filter data does not match the size')
  },
)

test('counting Bloom filters restored from plain arrays hold their counters in a Uint32Array', () => {
  const filter = new CountingBloomFilter({
    size: 2,
    hashes: 1,
    filter: [0, 0],
  })
  expect(filter.filter).toBeInstanceOf(Uint32Array)
})

test('elements added to a counting Bloom filter can be found in filters deserialised from JSON', () => {
  assert(
    property(string(), (element) => {
      const filter = new CountingBloomFilter({ size: 34, hashes: 1 })
      filter.add(element)
      const deserialisedFilter = new CountingBloomFilter(
        JSON.parse(JSON.stringify(filter)),
      )
      expect(deserialisedFilter.has(element)).toBe(1)
    }),
    { numRuns: 10 },
  )
})

test('serialization', () => {
  const filter = new CountingBloomFilter({ size: 5, hashes: 1 })
  const serialised = JSON.stringify(filter)
  expect(JSON.parse(serialised)).toEqual({
    filter: [0, 0, 0, 0, 0],
    hashes: 1,
    seed: 12648430,
    size: 5,
  })
})
