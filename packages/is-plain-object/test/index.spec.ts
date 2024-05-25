import {
  assert,
  anything,
  array,
  float,
  func,
  object,
  property,
  string,
} from 'fast-check'
import { expect, test } from 'vitest'
import { isPlainObject } from '../src'

test('Plain objects are plain objects', () => {
  assert(
    property(object(), (o) => {
      expect(isPlainObject(o)).toBe(true)
    }),
  )
})

test('Proxy is a plain object', () => {
  assert(
    property(object(), (o) => {
      expect(isPlainObject(new Proxy(o, {}))).toBe(true)
    }),
  )
})

test('Undefined is not a plain object', () => {
  expect(isPlainObject(undefined)).toBe(false)
})

test('Null is not a plain object', () => {
  expect(isPlainObject(null)).toBe(false)
})

test('A boolean is not a plain object', () => {
  expect(isPlainObject(true)).toBe(false)
  expect(isPlainObject(false)).toBe(false)
})

test('A string is not a plain object', () => {
  assert(
    property(string(), (s) => {
      expect(isPlainObject(s)).toBe(false)
    }),
  )
})

test('A number is not a plain object', () => {
  assert(
    property(float(), (f) => {
      expect(isPlainObject(f)).toBe(false)
    }),
  )
})

test('A function is not a plain object', () => {
  assert(
    property(func(anything()), (f) => {
      expect(isPlainObject(f)).toBe(false)
    }),
  )
})

test('An array is not a plain object', () => {
  assert(
    property(array(anything()), (a) => {
      expect(isPlainObject(a)).toBe(false)
    }),
  )
})

test('Symbol is not a plain object', () => {
  expect(isPlainObject(Symbol(''))).toBe(false)
})

test('RegExp is not a plain object', () => {
  expect(isPlainObject(/a/)).toBe(false)
  // eslint-disable-next-line prefer-regex-literals
  expect(isPlainObject(/(?:)/)).toBe(false)
})

test('Promise is not a plain object', () => {
  expect(isPlainObject(Promise.resolve())).toBe(false)
})

test.each<[string, any]>([
  ['ArrayBuffer', ArrayBuffer],
  ['Date', Date],
  ['Float32Array', Float32Array],
  ['Float64Array', Float64Array],
  ['Int8Array', Int8Array],
  ['Int16Array', Int16Array],
  ['Int32Array', Int32Array],
  ['Map', Map],
  ['Set', Set],
  ['Uint8Array', Uint8Array],
  ['Uint16Array', Uint16Array],
  ['Uint32Array', Uint32Array],
  ['BigUint64Array', BigUint64Array],
  ['Uint8ClampedArray', Uint8ClampedArray],
  ['WeakMap', WeakMap],
  ['WeakSet', WeakSet],
])('%s is not a plain object', (_, ArrayClass) => {
  expect(isPlainObject(new ArrayClass())).toBe(false)
})
