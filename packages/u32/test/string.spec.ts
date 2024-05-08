import { test, expect } from 'vitest'
import { assert, nat, property } from 'fast-check'
import { from, toString } from '../src/index'

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
