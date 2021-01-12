import { assert, property, string } from 'fast-check'
import { BloomFilter } from '../src/index'

test('a bloom filter is empty when created', () => {
  assert(
    property(string(), (text) => {
      const filter = new BloomFilter({ size: 34, hashes: 1 })
      expect(filter.has(text)).toBe(false)
    })
  )
})

test('added terms can be found', () => {
  assert(
    property(string(), (text) => {
      const filter = new BloomFilter({ size: 68, hashes: 1 })
      filter.add(text)
      expect(filter.has(text)).toBe(true)
    })
  )
})

test('missing terms cannot be found', () => {
  const filter = new BloomFilter({ size: 68, hashes: 1 })
  filter.add('foo')
  filter.add('bar')
  expect(filter.has('baz')).toBe(false)
})

test('requires at least one hash', () => {
  expect(() => new BloomFilter({ size: 34, hashes: 0 })).toThrow()
})

test('added terms can be found in filters deserialised from JSON', () => {
  assert(
    property(string(), (text) => {
      const filter = new BloomFilter({ size: 34, hashes: 1 })
      filter.add(text)
      const deserialisedFilter = new BloomFilter(
        JSON.parse(JSON.stringify(filter))
      )
      expect(deserialisedFilter.has(text)).toBe(true)
    })
  )
})

test('calculate optimised size and hashes from length and error rate', () => {
  const optimizedOptions = BloomFilter.optimal(2000, 0.005)
  expect(optimizedOptions).toEqual({ size: 22056, hashes: 8 })
})
