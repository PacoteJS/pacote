import { assert, property, string } from 'fast-check'
import { BloomFilter } from '../src/index'

test('a Bloom filter is empty when created', () => {
  assert(
    property(string(), (text) => {
      const filter = new BloomFilter({ size: 34, hashes: 1 })
      expect(filter.has(text)).toBe(false)
    })
  )
})

test('added elements can be found', () => {
  assert(
    property(string(), (element) => {
      const filter = new BloomFilter({ size: 68, hashes: 1 })
      filter.add(element)
      expect(filter.has(element)).toBe(true)
    })
  )
})

test('missing elements cannot be found', () => {
  const filter = new BloomFilter({ size: 68, hashes: 1 })
  filter.add('foo')
  filter.add('bar')
  expect(filter.has('baz')).toBe(false)
})

test('requires at least one hash', () => {
  expect(() => new BloomFilter({ size: 34, hashes: 0 })).toThrow()
})

test('added elements can be found in filters deserialised from JSON', () => {
  assert(
    property(string(), (element) => {
      const filter = new BloomFilter({ size: 34, hashes: 1 })
      filter.add(element)
      const deserialisedFilter = new BloomFilter(
        JSON.parse(JSON.stringify(filter))
      )
      expect(deserialisedFilter.has(element)).toBe(true)
    })
  )
})

test('calculate optimised size and hashes from length and error rate', () => {
  const optimizedOptions = BloomFilter.optimal(2000, 0.005)
  expect(optimizedOptions).toEqual({ size: 22056, hashes: 8 })
})
