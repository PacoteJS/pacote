import { assert, nat, property } from 'fast-check'
import { expect, test } from 'vitest'
// biome-ignore lint/suspicious/noShadowRestrictedNames: global toString not used
import { from, toString } from '../src'

test('creates U32 values from strings', () => {
  assert(
    property(nat(), (value) => {
      expect(from(String(value))).toEqual(from(value))
    }),
  )
})

test('converts U32 values to and from strings', () => {
  assert(
    property(nat().map(String), (s) => {
      expect(toString(from(s))).toEqual(s)
    }),
  )
})
