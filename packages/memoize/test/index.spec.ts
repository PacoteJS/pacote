import { memoize } from '../src/index'

test('memoize calls the original function', () => {
  const fn = (i: number) => `test ${i}`
  const memoizedFn = memoize(i => `${i}`, fn)
  expect(memoizedFn(1)).toEqual(fn(1))
})

test('memoize caches function calls', () => {
  const randomFn = () => Math.random()
  const memoizedFn = memoize(() => '_', randomFn)
  expect(memoizedFn()).toEqual(memoizedFn())
})
