import { assert, nat, property } from 'fast-check'
import { expect, test, vi } from 'vitest'
import { times } from '../src/index'

test('an empty array is returned when function is run 0 times', () => {
  const actual = times(0, () => undefined)
  expect(actual).toEqual([])
})

test('no functions are called when run zero times', () => {
  assert(
    property(nat(100), (n) => {
      const fn = vi.fn()
      times(n, fn)
      expect(fn).toHaveBeenCalledTimes(n)
    }),
  )
})

test('build an array with the result of each function', () => {
  const fn = (n: number) => n + 1
  const actual = times(5, fn)
  expect(actual).toEqual([1, 2, 3, 4, 5])
})
