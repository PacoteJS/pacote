import { assert, object, property } from 'fast-check'
import { expect, test } from 'vitest'
import { associate } from '../src/index'

test('turn an empty array into an empty record', () => {
  expect(associate((i) => [i, i], [])).toEqual({})
})

test('turn a non-empty array into a record', () => {
  expect(associate((i) => [i, i], ['a', 'b'])).toEqual({ a: 'a', b: 'b' })
})

test('duplicate keys are overwritten', () => {
  expect(associate((i) => ['same', i], ['a', 'b'])).toEqual({ same: 'b' })
})

test.skip('inverse of Object.entries', () => {
  assert(
    property(object(), (o) => {
      expect(associate((i) => i, Object.entries(o))).toEqual(o)
    }),
  )
})
