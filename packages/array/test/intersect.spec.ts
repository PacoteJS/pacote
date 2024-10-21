import { expect, test } from 'vitest'
import { intersect } from '../src/index'

test('two equal arrays', () => {
  expect(intersect([1], [1])).toEqual([1])
})

test('elements in the left array', () => {
  expect(intersect([1], [])).toEqual([])
})

test('elements in the right array', () => {
  expect(intersect([], [1])).toEqual([])
})

test('different elements in the arrays', () => {
  expect(intersect([1], [2])).toEqual([])
})

test('two arrays with overlapping elements', () => {
  expect(intersect([1, 2, 3], [1, 3])).toEqual([1, 3])
})
