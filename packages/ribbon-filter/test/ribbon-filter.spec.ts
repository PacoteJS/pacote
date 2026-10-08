/// <reference types="node" />
import { hash } from 'node:crypto'
import { xxh64 } from '@pacote/xxhash'
import { array, assert, property, string } from 'fast-check'
import { describe, expect, test } from 'vitest'
import { optimal, RibbonFilter } from '../src/index'

/**
 * Node's native MD5, one 32-bit word of the digest per index. Used where a
 * test needs many queries; the default XXH64 hash is too slow for that.
 */
const fastHash = (index: number, data: string): number =>
  hash('md5', data, 'buffer').readUInt32LE(index * 4)

/** Hash returning fixed [start, coefficients, fingerprint] values per element. */
const fixedHash =
  (values: Record<string, [number, number, number]>) =>
  (index: number, data: string): number =>
    values[data][index]

test('a Ribbon filter built from no elements is empty', () => {
  assert(
    property(string(), (text) => {
      const filter = new RibbonFilter<string>({
        fingerprintBits: 32,
        elements: [],
      })
      expect(filter.has(text)).toBe(false)
    }),
  )
})

test('elements a Ribbon filter was built from can be found', () => {
  assert(
    property(array(string(), { maxLength: 200 }), (elements) => {
      const filter = new RibbonFilter({
        ...optimal(0.001),
        elements,
      })
      for (const element of elements) expect(filter.has(element)).toBe(true)
    }),
  )
})

test('elements a Ribbon filter was built from can be found using a provided hash function', () => {
  const hashers = [xxh64(1), xxh64(2), xxh64(3)]
  const hash = (i: number, data: string): number =>
    Number.parseInt(hashers[i].update(data).digest('hex').substring(8, 16), 16)

  assert(
    property(array(string(), { maxLength: 50 }), (elements) => {
      const filter = new RibbonFilter({
        ...optimal(0.001),
        hash,
        elements,
      })
      for (const element of elements) expect(filter.has(element)).toBe(true)
    }),
  )
})

test('elements missing from a Ribbon filter cannot be found', () => {
  const filter = new RibbonFilter({
    ...optimal(0.001),
    elements: ['foo', 'bar'],
  })
  expect(filter.has('baz')).toBe(false)
})

test('duplicate elements can be found', () => {
  const filter = new RibbonFilter({
    ...optimal(0.001),
    elements: ['foo', 'foo', 'bar'],
  })
  expect(filter.has('foo')).toBe(true)
  expect(filter.has('bar')).toBe(true)
})

test('non-ASCII elements can be found', () => {
  const elements = ['ação', 'naïve', '日本語', '🎀']
  const filter = new RibbonFilter({ ...optimal(0.001), elements })
  for (const element of elements) expect(filter.has(element)).toBe(true)
})

test.each([1, 32])(
  'elements can be found with %i fingerprint bits',
  (fingerprintBits) => {
    const elements = ['foo', 'bar', 'baz']
    const filter = new RibbonFilter({ fingerprintBits, elements })
    for (const element of elements) expect(filter.has(element)).toBe(true)
  },
)

describe('table size', () => {
  test('a table built from a few elements has one spare row', () => {
    const filter = new RibbonFilter({
      fingerprintBits: 32,
      hash: fixedHash({ foo: [0, 0, 1], bar: [0, 0b10, 2] }),
      elements: ['foo', 'bar'],
    })
    expect(filter.size).toBe(3)
  })

  test('a table built from 10,000 elements has 11% to 20% spare rows', () => {
    const filter = new RibbonFilter({
      fingerprintBits: 8,
      hash: fastHash,
      elements: Array.from({ length: 10_000 }, (_, i) => `present ${i}`),
    })
    expect(filter.size).toBeGreaterThanOrEqual(11_100)
    expect(filter.size).toBeLessThanOrEqual(12_000)
  })

  test('grows a table that cannot store its elements', () => {
    // A 3-row table masks bar's coefficients 0b1000 to 0b000, which makes
    // them the same as foo's; a 4-row table keeps them apart.
    const filter = new RibbonFilter({
      fingerprintBits: 32,
      hash: fixedHash({ foo: [0, 0, 1], bar: [0, 0b1000, 2] }),
      elements: ['foo', 'bar'],
    })
    expect(filter.size).toBe(4)
    expect(filter.has('foo')).toBe(true)
    expect(filter.has('bar')).toBe(true)
  })

  test('rounds the table up to fill its last 32-bit word', () => {
    // Two 8-bit rows plus a spare one take 3 of the 4 rows in one word.
    const filter = new RibbonFilter({
      fingerprintBits: 8,
      hash: fixedHash({ foo: [0, 0, 1], bar: [0, 0b10, 2] }),
      elements: ['foo', 'bar'],
    })
    expect(filter.size).toBe(4)
  })

  test('throws when elements can never be stored together', () => {
    const build = () =>
      new RibbonFilter({
        fingerprintBits: 8,
        hash: fixedHash({ foo: [0, 0, 1], bar: [0, 0, 2] }),
        elements: ['foo', 'bar'],
      })
    expect(build).toThrow('unable to build the filter')
  })
})

describe('false positive rate', () => {
  test.each([
    [5, 8],
    [5, 12],
    [50, 8],
    [50, 12],
    [1000, 8],
    [1000, 12],
    [10000, 8],
    [10000, 12],
  ])(
    'for %i elements is within half and double of 2^-%i',
    (items, fingerprintBits) => {
      const rate = 2 ** -fingerprintBits
      const queries = 64 / rate
      const filter = new RibbonFilter({
        fingerprintBits,
        hash: fastHash,
        elements: Array.from({ length: items }, (_, i) => `present ${i}`),
      })

      let falsePositives = 0
      for (let i = 0; i < queries; i++) {
        if (filter.has(`absent ${i}`)) falsePositives++
      }

      expect(falsePositives / queries).toBeGreaterThanOrEqual(rate / 2)
      expect(falsePositives / queries).toBeLessThanOrEqual(rate * 2)
    },
  )

  test('is within half and double of 2^-8 for 1000 elements with the default hash', () => {
    const rate = 2 ** -8
    const queries = 32 / rate
    const filter = new RibbonFilter({
      ...optimal(rate),
      elements: Array.from({ length: 1000 }, (_, i) => `present ${i}`),
    })

    let falsePositives = 0
    for (let i = 0; i < queries; i++) {
      if (filter.has(`absent ${i}`)) falsePositives++
    }

    expect(falsePositives / queries).toBeGreaterThanOrEqual(rate / 2)
    expect(falsePositives / queries).toBeLessThanOrEqual(rate * 2)
  }, 30_000)
})

test.each([0, 33, 8.5, Number.NaN])(
  'requires an integer between 1 and 32 fingerprint bits, not %d',
  (fingerprintBits) => {
    expect(() => new RibbonFilter({ fingerprintBits, elements: [] })).toThrow(
      'fingerprint bits must be an integer between 1 and 32',
    )
  },
)

test('cannot be restored from empty filter data', () => {
  expect(() => new RibbonFilter({ fingerprintBits: 8, filter: [] })).toThrow(
    'filter data cannot be empty',
  )
})

test('a restored filter has the size of the filter it was serialised from', () => {
  const filter = new RibbonFilter({
    fingerprintBits: 14,
    elements: Array.from({ length: 100 }, (_, i) => `element ${i}`),
  })
  const restored = new RibbonFilter(JSON.parse(JSON.stringify(filter)))
  expect(restored.size).toBe(filter.size)
})

test('cannot be built from elements and restored from filter data at once', () => {
  const options = {
    fingerprintBits: 8,
    elements: ['foo'],
    filter: [0, 0],
  }
  // @ts-expect-error: elements and filter data are mutually exclusive
  expect(() => new RibbonFilter(options)).toThrow()
})

test('elements a Ribbon filter was built from can be found in filters deserialised from JSON', () => {
  assert(
    property(array(string(), { maxLength: 50 }), (elements) => {
      const filter = new RibbonFilter({
        ...optimal(0.001),
        elements,
      })
      const deserialisedFilter = new RibbonFilter(
        JSON.parse(JSON.stringify(filter)),
      )
      for (const element of elements) {
        expect(deserialisedFilter.has(element)).toBe(true)
      }
    }),
  )
})

test('the same elements and options build the same filter', () => {
  const build = () =>
    new RibbonFilter({ ...optimal(0.001), elements: ['foo', 'bar', 'baz'] })
  expect(JSON.stringify(build())).toEqual(JSON.stringify(build()))
})

test.each([1, 8, 14, 32])(
  'packs rows of %i bits into 32-bit words',
  (fingerprintBits) => {
    const filter = new RibbonFilter({
      fingerprintBits,
      elements: Array.from({ length: 100 }, (_, i) => `element ${i}`),
    })
    expect(filter.toJSON().filter).toHaveLength(
      Math.ceil((filter.size * fingerprintBits) / 32),
    )
  },
)

test('serialization', () => {
  const filter = new RibbonFilter({ fingerprintBits: 8, elements: [] })
  const serialised = JSON.stringify(filter)
  expect(JSON.parse(serialised)).toEqual({
    filter: [0],
    fingerprintBits: 8,
    seed: 12648430,
  })
})
