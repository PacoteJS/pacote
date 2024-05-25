import { range } from '@pacote/array'
import { assert, integer, property } from 'fast-check'
import { expect, test } from 'vitest'
import { shuffle } from '../src/index'

test('shuffling an array', () => {
  const items = range(0, 100)
  expect(shuffle(items)).not.toEqual(items)
})

test('shuffling preserves collection items', () => {
  assert(
    property(integer({ min: 1, max: 100 }), (length) => {
      const items = range(0, length)
      const shuffled = shuffle(items)
      expect(shuffled.sort()).toEqual(items.sort())
    }),
  )
})
