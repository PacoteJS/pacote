import { test, expect, vi } from 'vitest'
import { assert, property, func, string, anything } from 'fast-check'
import { memoize } from '../src/index'

test('memoize calls the original function', () => {
  assert(
    property(func<[string], any>(anything()), string(), (fn, s) => {
      const memoizedFn = memoize((i) => i, fn)
      expect(memoizedFn(s)).toEqual(fn(s))
    }),
  )
})

test('memoize caches function calls', () => {
  const randomFn = () => Math.random()
  const memoizedFn = memoize(() => '_', randomFn)
  expect(memoizedFn()).toEqual(memoizedFn())
})

test('clear memoize cache', () => {
  const mockFn = vi.fn()
  const memoizedFn = memoize(() => '_', mockFn)

  memoizedFn()
  memoizedFn.clear()
  memoizedFn()

  expect(mockFn).toHaveBeenCalledTimes(2)
})

test('evict LRU calls', () => {
  const mockFn = vi.fn()
  const memoizedFn = memoize((n) => n, mockFn, { capacity: 1 })

  memoizedFn(1)
  memoizedFn(2)
  memoizedFn(1)

  expect(mockFn).toHaveBeenCalledTimes(3)
  expect(mockFn).toHaveBeenLastCalledWith(1)
})
