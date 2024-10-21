import { expect, test } from 'vitest'
import { difference } from '../src/index'

test('two empty arrays have no difference', () => {
  expect(difference([], [])).toEqual([[], []])
})

test('elements in the left array but none in the right', () => {
  expect(difference([1, 2, 3], [])).toEqual([[1, 2, 3], []])
})

test('elements in the right array but none in the left', () => {
  expect(difference([], [1, 2, 3])).toEqual([[], [1, 2, 3]])
})

test('elements in the left array but absent from the right', () => {
  expect(difference([1, 2, 3], [2, 4, 6])[0]).toEqual([1, 3])
})

test('elements in the right array but absent from the left', () => {
  expect(difference([1, 2, 3], [2, 4, 6])[1]).toEqual([4, 6])
})
