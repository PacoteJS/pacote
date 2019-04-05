import {
  anything,
  array,
  assert,
  float,
  func,
  object,
  property,
  string
} from 'fast-check'
import { isPlainObject } from '../src'

test('true for plain objects', () => {
  assert(
    property(object(), o => {
      expect(isPlainObject(o)).toBe(true)
    })
  )
})

test('true for instances of Proxy', () => {
  assert(
    property(object(), o => {
      expect(isPlainObject(new Proxy(o, {}))).toBe(true)
    })
  )
})

test('false for undefined', () => {
  expect(isPlainObject(undefined)).toBe(false)
})

test('false for null', () => {
  expect(isPlainObject(null)).toBe(false)
})

test('false for booleans', () => {
  expect(isPlainObject(true)).toBe(false)
  expect(isPlainObject(false)).toBe(false)
})

test('false for strings', () => {
  assert(
    property(string(), s => {
      expect(isPlainObject(s)).toBe(false)
    })
  )
})

test('false for numbers', () => {
  assert(
    property(float(), f => {
      expect(isPlainObject(f)).toBe(false)
    })
  )
})

test('false for functions', () => {
  assert(
    property(func(anything()), f => {
      expect(isPlainObject(f)).toBe(false)
    })
  )
})

test('false for arrays', () => {
  assert(
    property(array(anything()), a => {
      expect(isPlainObject(a)).toBe(false)
    })
  )
})

test('false for Symbols', () => {
  expect(isPlainObject(Symbol())).toBe(false)
})

test('false for instances of RegExp', () => {
  expect(isPlainObject(/a/)).toBe(false)
  expect(isPlainObject(RegExp(''))).toBe(false)
})

test('false for Promises', () => {
  expect(isPlainObject(Promise.resolve())).toBe(false)
})

test.each<[string, any]>([
  ['ArrayBuffer', ArrayBuffer],
  ['Date', Date],
  ['Float32Array', Float32Array],
  ['Float64Array', Float64Array],
  ['Int16Array', Int16Array],
  ['Int16Array', Int16Array],
  ['Int32Array', Int32Array],
  ['Int32Array', Int32Array],
  ['Int8Array', Int8Array],
  ['Map', Map],
  ['Set', Set],
  ['Uint16Array', Uint16Array],
  ['Uint32Array', Uint32Array],
  ['Uint8Array', Uint8Array],
  ['Uint8ClampedArray', Uint8ClampedArray],
  ['WeakMap', WeakMap],
  ['WeakSet', WeakSet]
])('false for instances of %s', (_, ArrayClass) => {
  expect(isPlainObject(new ArrayClass())).toBe(false)
})
