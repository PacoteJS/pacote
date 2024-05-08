import { test, expect } from 'vitest'
import { assert, nat, property } from 'fast-check'
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
