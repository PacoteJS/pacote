import { assert, property, func, string } from 'fast-check'
import { memoize } from '../src/index'

test('memoize calls the original function', () => {
  assert(
    property(func(string()), string(), (fn, s) => {
      const memoizedFn = memoize(i => i, fn)
      expect(memoizedFn(s)).toEqual(fn(s))
    })
  )
})

test('memoize caches function calls', () => {
  const randomFn = () => Math.random()
  const memoizedFn = memoize(() => '_', randomFn)
  expect(memoizedFn()).toEqual(memoizedFn())
})
