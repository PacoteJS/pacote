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

test('false for array instances', () => {
  expect(isPlainObject(new Float32Array(0))).toBe(false)
  expect(isPlainObject(new Float64Array(0))).toBe(false)
  expect(isPlainObject(new Int16Array(0))).toBe(false)
  expect(isPlainObject(new Int16Array(0))).toBe(false)
  expect(isPlainObject(new Int32Array(0))).toBe(false)
  expect(isPlainObject(new Int32Array(0))).toBe(false)
  expect(isPlainObject(new Int8Array(0))).toBe(false)
  expect(isPlainObject(new Uint16Array(0))).toBe(false)
  expect(isPlainObject(new Uint32Array(0))).toBe(false)
  expect(isPlainObject(new Uint8Array(0))).toBe(false)
  expect(isPlainObject(new Uint8ClampedArray(0))).toBe(false)
})

test('false for instances of Symbol', () => {
  expect(isPlainObject(Symbol())).toBe(false)
})

test('false for instances of Map', () => {
  expect(isPlainObject(new Set())).toBe(false)
})

test('false for instances of WeakMap', () => {
  expect(isPlainObject(new WeakSet())).toBe(false)
})

test('false for instances of Map', () => {
  expect(isPlainObject(new Map())).toBe(false)
})

test('false for instances of WeakMap', () => {
  expect(isPlainObject(new WeakMap())).toBe(false)
})

test('false for instances of Date', () => {
  expect(isPlainObject(new Date())).toBe(false)
})

test('false for instances of RegExp', () => {
  expect(isPlainObject(/a/)).toBe(false)
  expect(isPlainObject(RegExp(''))).toBe(false)
})

test('false for instances of ArrayBuffer', () => {
  expect(isPlainObject(new ArrayBuffer(0))).toBe(false)
})

test('false for promises', () => {
  expect(isPlainObject(new Promise(() => null))).toBe(false)
})
