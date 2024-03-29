import { assert, object, property } from 'fast-check'
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

// eslint-disable-next-line jest/no-disabled-tests
test.skip('inverse of Object.entries', () => {
  assert(
    property(object(), (o) => {
      expect(associate((i) => i, Object.entries(o))).toEqual(o)
    }),
  )
})
