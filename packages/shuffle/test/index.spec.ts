import { assert, property, integer } from 'fast-check'
import { range } from 'ramda'
import { shuffle } from '../src/index'

test('shuffling an array', () => {
  const items = range(0, 100)
  expect(shuffle(items)).not.toEqual(items)
})

test('shuffling preserves collection items', () => {
  assert(
    property(integer(1, 100), (length) => {
      const items = range(0, length)
      const shuffled = shuffle(items)
      expect(shuffled.sort()).toEqual(items.sort())
    })
  )
})
