import { test, expect } from 'vitest'
import { unique } from '../src/index'

test('an empty array is returned unchanged', () => {
  const actual = unique([])
  expect(actual).toEqual([])
})

test('a unique array is returned unchanged', () => {
  const actual = unique([3, 2, 1])
  expect(actual).toEqual([3, 2, 1])
})

test('duplicated values are removed', () => {
  const actual = unique([1, 3, 2, 1])
  expect(actual).toEqual([1, 3, 2])
})
