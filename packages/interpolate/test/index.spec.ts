import { expect, test } from 'vitest'
import { interpolate } from '../src/index'

test('no placeholders', () => {
  const render = interpolate('test')
  expect(render()).toBe('test')
})

test('single placeholder replacement', () => {
  const render = interpolate('Hello, {{ name }}!')
  expect(render({ name: 'world' })).toBe('Hello, world!')
})

test('undefined value replacement', () => {
  const render = interpolate('Hello, {{ name }}!')
  expect(render({ name: undefined })).toBe('Hello, !')
  expect(render({ name: null })).toBe('Hello, !')
})

test('multiple-word placeholder', () => {
  const render = interpolate('Hello, {{ name to replace }}!')
  expect(render({ 'name to replace': 'world' })).toBe('Hello, world!')
})

test('multiple placeholder replacement with a data object', () => {
  const render = interpolate('Hello, {{ a }} and {{ b }}!')
  expect(render({ a: 'Alice', b: 'Bob' })).toBe('Hello, Alice and Bob!')
})

test('multiple placeholder replacement with a data array', () => {
  const render = interpolate('Hello, {{0}} and {{1}}!')
  expect(render(['Alice', 'Bob'])).toBe('Hello, Alice and Bob!')
})

test('user-defined interpolation pattern', () => {
  const render = interpolate('Hello, %{ name }!', /%{([\s\S]+?)}/)
  expect(render({ name: 'world' })).toBe('Hello, world!')
})
