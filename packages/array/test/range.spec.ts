import { test, expect } from 'vitest'
import { range } from '../src/index'

test('an empty range (end is not inclusive)', () => {
  expect(range(0, 0)).toEqual([])
})

test('an range with start and end values', () => {
  expect(range(0, 1)).toEqual([0])
})

test('an range with negative start and end values', () => {
  expect(range(-3, -1)).toEqual([-3, -2])
})
