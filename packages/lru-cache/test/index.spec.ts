import { LRUCache } from '../src/index'

describe('set', () => {
  it('evicts least-recently used key', () => {
    const cache = new LRUCache(1)

    cache.set('evicted', 'will be removed')
    cache.set('stored', 'ok')

    expect(cache.get('evicted')).toBe(undefined)
    expect(cache.get('stored')).toBe('ok')
  })

  it('prevents eviction of used key', () => {
    const cache = new LRUCache(2)

    cache.set('stored', 'ok')
    cache.set('evicted', 'will be removed')
    cache.set('stored', 'updated')
    cache.set('stored over capacity', 'will evict LRU')

    expect(cache.get('stored')).toBe('updated')
    expect(cache.get('evicted')).toBe(undefined)
  })
})

test('get prevents eviction of used key', () => {
  const cache = new LRUCache(2)

  cache.set('stored', 'ok')
  cache.set('evicted', 'will be removed')
  cache.get('stored')
  cache.set('stored over capacity', 'will evict LRU')

  expect(cache.get('stored')).toBe('ok')
  expect(cache.get('evicted')).toBe(undefined)
})

describe('size', () => {
  it('is 0 when cache is empty', () => {
    const cache = new LRUCache(1)

    expect(cache.size).toBe(0)
  })

  it('is greater than 0 when cache is populated', () => {
    const cache = new LRUCache(10)
    cache.set('test', 'ok')

    expect(cache.size).toBe(1)
  })
})

test('delete', () => {
  const cache = new LRUCache(1)
  cache.set('delete', 1)

  cache.delete('delete')

  expect(cache.get('delete')).toBe(undefined)
})

test('has', () => {
  const cache = new LRUCache(1)

  cache.set('set', 'ok')

  expect(cache.has('set')).toBe(true)
})

test('clear', () => {
  const cache = new LRUCache(1)
  cache.set('delete', 1)

  cache.delete('delete')

  expect(cache.get('delete')).toBe(undefined)
})

test.each([-1, 0, 0.5, Infinity, NaN])('invalid capacity', (capacity) => {
  expect(() => new LRUCache(capacity)).toThrow(
    'Capacity must be a positive integer'
  )
})
