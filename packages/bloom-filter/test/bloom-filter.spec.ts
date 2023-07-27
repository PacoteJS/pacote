import { assert, property, string } from 'fast-check'
import { BloomFilter } from '../src/index'
import { xxh64 } from '@pacote/xxhash'

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
    const d1 = parseInt(h1.update(data).digest('hex').substring(8, 16), 16)
    const d2 = parseInt(h2.update(data).digest('hex').substring(8, 16), 16)
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

test('requires at least one hash', () => {
  expect(() => new BloomFilter({ size: 34, hashes: 0 })).toThrow()
})

test('cannot have size 0', () => {
  expect(() => new BloomFilter({ size: 0, hashes: 1 })).toThrow()
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
