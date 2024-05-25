import { assert, nat, property } from 'fast-check'
import { expect, test } from 'vitest'
import { from, toNumber } from '../src/index'

test.each([
  [0, [0, 0]],
  [1, [1, 0]],
  [65535, [65535, 0]],
  [65536, [0, 1]],
  [Number.MAX_SAFE_INTEGER, [65535, 65535]],
])('converts from %d', (value, expected) => {
  expect(from(value)).toEqual(expected)
})

test('converts U32 values to and from integers', () => {
  assert(
    property(nat(), (value) => {
      expect(toNumber(from(value))).toEqual(value)
    }),
  )
})
