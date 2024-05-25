import { expect, test } from 'vitest'
import { windowed } from '../src/index'

test('an empty array has no windows', () => {
  expect(windowed(2, [])).toEqual([])
})

test('an array smaller or equal to size is its own window', () => {
  expect(windowed(2, [1])).toEqual([[1]])
})

test('an array larger than size has n-1 windows', () => {
  expect(windowed(2, [1, 2, 3])).toEqual([
    [1, 2],
    [2, 3],
  ])
})

test('the window is of the provided size', () => {
  expect(windowed(3, [1, 2, 3, 4])).toEqual([
    [1, 2, 3],
    [2, 3, 4],
  ])
})

test('the window slides with the provided step', () => {
  expect(windowed(2, 2, [1, 2, 3, 4])).toEqual([
    [1, 2],
    [3, 4],
  ])
})

test('size must be a positive integer', () => {
  expect(() => windowed(0, [1, 2, 3])).toThrow(
    Error('size must be a positive integer'),
  )
})

test('step must be a positive integer', () => {
  expect(() => windowed(2, 0, [1, 2, 3])).toThrow(
    Error('step must be a positive integer'),
  )
})
