import { anything, assert, property } from 'fast-check'
import { pipe } from '../src/index'

test('pipe takes any value', () => {
  assert(
    property(anything(), (value) => {
      const result = pipe(value)
      expect(result.value).toBe(value)
    })
  )
})

test('chaining pipe calls a function on the stored value', () => {
  const value = 2
  const double = (i: number) => i * 2

  const result = pipe(value).then(double)

  expect(result.value).toBe(4)
})

test('chaining pipe calls multiple functions in succession', () => {
  const doubleSay = (_: string) => _ + ', ' + _
  const capitalize = (_: string) => _[0].toUpperCase() + _.substring(1)
  const exclaim = (_: string) => _ + '!'

  const result = pipe('hello').then(doubleSay).then(capitalize).then(exclaim)

  expect(result.value).toBe('Hello, hello!')
})
