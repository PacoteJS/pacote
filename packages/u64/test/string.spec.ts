import { assert, nat, property } from 'fast-check'
import { expect, test } from 'vitest'
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { from, toString } from '../src/index'

test('creates U64 values from strings', () => {
  assert(
    property(nat(), (value) => {
      expect(from(String(value))).toEqual(from(value))
    }),
  )
})

test('converts U64 values to and from strings', () => {
  assert(
    property(nat().map(String), (s) => {
      expect(toString(from(s))).toEqual(s)
    }),
  )
})
