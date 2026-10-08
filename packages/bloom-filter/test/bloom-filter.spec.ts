import { xxh64 } from '@pacote/xxhash'
import { assert, property, string } from 'fast-check'
import { expect, test } from 'vitest'
import { BloomFilter } from '../src/index'

test('a Bloom filter is empty when created', () => {
  assert(
    property(string(), (text) => {
      const filter = new BloomFilter({ size: 34, hashes: 1 })
      expect(filter.has(text)).toBe(false)
    }),
  )
})

test('elements added to a Bloom filter can be found', () => {
  assert(
    property(string(), (element) => {
      const filter = new BloomFilter({ size: 68, hashes: 1 })
      filter.add(element)
      expect(filter.has(element)).toBe(true)
    }),
  )
})

test('elements added to a Bloom filter can be found using provided hash functions', () => {
  const h1 = xxh64(1)
  const h2 = xxh64(2)

  const hash = (i: number, data: string): number => {
    const d1 = Number.parseInt(
      h1.update(data).digest('hex').substring(8, 16),
      16,
    )
    const d2 = Number.parseInt(
      h2.update(data).digest('hex').substring(8, 16),
      16,
    )
    return d1 + i * d2 + i ** 3
  }

  assert(
    property(string(), (element) => {
      const filter = new BloomFilter({ size: 68, hashes: 1, hash })
      filter.add(element)
      expect(filter.has(element)).toBe(true)
    }),
  )
})

test('elements missing from a Bloom filter cannot be found', () => {
  const filter = new BloomFilter({ size: 68, hashes: 1 })
  filter.add('foo')
  filter.add('bar')
  expect(filter.has('baz')).toBe(false)
})

test.each([0, 1.5, Number.NaN])(
  'requires a positive integer number of hashes, not %d',
  (hashes) => {
    expect(() => new BloomFilter({ size: 34, hashes })).toThrow(
      'number of hashes must be a positive integer',
    )
  },
)

test.each([0, 34.5, Number.NaN])(
  'requires a positive integer size, not %d',
  (size) => {
    expect(() => new BloomFilter({ size, hashes: 1 })).toThrow(
      'size must be a positive integer',
    )
  },
)

test.each([[[0]], [[0, 0, 0]]])(
  'cannot be restored from filter data of the wrong length',
  (filter) => {
    expect(() => new BloomFilter({ size: 64, hashes: 1, filter })).toThrow(
      'filter data does not match the size',
    )
  },
)

test('filters restored from plain arrays hold their data in a Uint32Array', () => {
  const filter = new BloomFilter({ size: 64, hashes: 1, filter: [0, 0] })
  expect(filter.filter).toBeInstanceOf(Uint32Array)
})

test('elements added to a Bloom filter can be found in filters deserialised from JSON', () => {
  assert(
    property(string(), (element) => {
      const filter = new BloomFilter({ size: 34, hashes: 1 })
      filter.add(element)
      const deserialisedFilter = new BloomFilter(
        JSON.parse(JSON.stringify(filter)),
      )
      expect(deserialisedFilter.has(element)).toBe(true)
    }),
  )
})

test('serialization', () => {
  const filter = new BloomFilter({ size: 64, hashes: 1 })
  const serialised = JSON.stringify(filter)
  expect(JSON.parse(serialised)).toEqual({
    filter: [0, 0],
    hashes: 1,
    seed: 12648430,
    size: 64,
  })
})
