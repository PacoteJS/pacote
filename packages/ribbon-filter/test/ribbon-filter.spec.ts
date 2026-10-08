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
        size: 34,
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
        ...optimal(elements.length, 0.001),
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
        ...optimal(elements.length, 0.001),
        hash,
        elements,
      })
      for (const element of elements) expect(filter.has(element)).toBe(true)
    }),
  )
})

test('elements missing from a Ribbon filter cannot be found', () => {
  const filter = new RibbonFilter({
    ...optimal(2, 0.001),
    elements: ['foo', 'bar'],
  })
  expect(filter.has('baz')).toBe(false)
})

test('duplicate elements can be found', () => {
  const filter = new RibbonFilter({
    ...optimal(3, 0.001),
    elements: ['foo', 'foo', 'bar'],
  })
  expect([filter.has('foo'), filter.has('bar')]).toEqual([true, true])
})

test('non-ASCII elements can be found', () => {
  const elements = ['ação', 'naïve', '日本語', '🎀']
  const filter = new RibbonFilter({ ...optimal(4, 0.001), elements })
  expect(elements.map((element) => filter.has(element))).toEqual([
    true,
    true,
    true,
    true,
  ])
})

test.each([1, 32])(
  'elements can be found with %i fingerprint bits',
  (fingerprintBits) => {
    const elements = ['foo', 'bar', 'baz']
    const filter = new RibbonFilter({ size: 8, fingerprintBits, elements })
    expect(elements.map((element) => filter.has(element))).toEqual([
      true,
      true,
      true,
    ])
  },
)

describe('construction failure', () => {
  test('grows the filter until conflicting elements can be stored', () => {
    // With 40 rows and a 32-row band there are 9 start positions, so starts
    // 0 and 9 collide; at 42 rows (one growth step) they no longer do.
    const filter = new RibbonFilter({
      size: 40,
      fingerprintBits: 8,
      hash: fixedHash({ foo: [0, 0, 1], bar: [9, 0, 2] }),
      elements: ['foo', 'bar'],
    })
    expect(filter.size).toBe(42)
    expect([filter.has('foo'), filter.has('bar')]).toEqual([true, true])
  })

  test('grows a filter smaller than the band by one row', () => {
    // Below 32 rows the band spans the whole filter. Coefficients 0b10000 are
    // masked to 0b00001 at 4 rows, the same as foo's; at 5 rows they differ.
    const filter = new RibbonFilter({
      size: 4,
      fingerprintBits: 8,
      hash: fixedHash({ foo: [0, 0, 1], bar: [0, 0b10000, 2] }),
      elements: ['foo', 'bar'],
    })
    expect(filter.size).toBe(5)
    expect([filter.has('foo'), filter.has('bar')]).toEqual([true, true])
  })

  test('throws when elements can never be stored together', () => {
    const build = () =>
      new RibbonFilter({
        size: 40,
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
        size: optimal(items, rate).size,
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
      ...optimal(1000, rate),
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

test('requires between 1 and 32 fingerprint bits', () => {
  expect(
    () => new RibbonFilter({ size: 8, fingerprintBits: 0, elements: [] }),
  ).toThrow()
  expect(
    () => new RibbonFilter({ size: 8, fingerprintBits: 33, elements: [] }),
  ).toThrow()
})

test('cannot have size 0', () => {
  expect(
    () => new RibbonFilter({ size: 0, fingerprintBits: 8, elements: [] }),
  ).toThrow()
})

test('cannot be built from elements and restored from filter data at once', () => {
  const options = {
    size: 8,
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
        ...optimal(elements.length, 0.001),
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
    new RibbonFilter({ ...optimal(3, 0.001), elements: ['foo', 'bar', 'baz'] })
  expect(JSON.stringify(build())).toEqual(JSON.stringify(build()))
})

test.each([
  [8, 8, 2],
  [100, 14, 44],
  [33, 32, 33],
  [3, 1, 1],
])(
  'stores %i rows of %i bits in %i 32-bit words',
  (size, fingerprintBits, words) => {
    const filter = new RibbonFilter({ size, fingerprintBits, elements: [] })
    expect(filter.toJSON().filter).toHaveLength(words)
  },
)

test('serialization', () => {
  const filter = new RibbonFilter({ size: 8, fingerprintBits: 8, elements: [] })
  const serialised = JSON.stringify(filter)
  expect(JSON.parse(serialised)).toEqual({
    filter: [0, 0],
    fingerprintBits: 8,
    seed: 12648430,
    size: 8,
  })
})
