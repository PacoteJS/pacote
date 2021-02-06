import { assert, nat, property } from 'fast-check'
import { from, toNumber } from '../src/index'

test.each([
  [0, [0, 0, 0, 0]],
  [1, [1, 0, 0, 0]],
  [65535, [65535, 0, 0, 0]],
  [65536, [0, 1, 0, 0]],
  [Number.MAX_SAFE_INTEGER, [65535, 65535, 0, 0]],
])('converts from %d', (value, expected) => {
  expect(from(value)).toEqual(expected)
})

test('converts U64 values to and from integers', () => {
  assert(
    property(nat(), (value) => {
      expect(toNumber(from(value))).toEqual(value)
    })
  )
})
