import { expect, test } from 'vitest'
import { chunked } from '../src/index'

test('an empty array has no chunks', () => {
  expect(chunked(2, [])).toEqual([])
})

test('an array smaller or equal to size is its own chunk', () => {
  expect(chunked(2, [1])).toEqual([[1]])
})

test('an array can be chunked into individual elements', () => {
  expect(chunked(1, [1, 2, 3, 4])).toEqual([[1], [2], [3], [4]])
})

test('the chunks are of the provided size', () => {
  expect(chunked(2, [1, 2, 3, 4])).toEqual([
    [1, 2],
    [3, 4],
  ])
})

test('size must be a positive integer', () => {
  expect(() => chunked(0, [1, 2, 3])).toThrow(
    Error('size must be a positive integer'),
  )
})
