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

test('map a function over the stored value', () => {
  const value = 2
  const double = (i: number) => i * 2

  const result = pipe(value).map(double)

  expect(result.value).toBe(4)
})

test('map multiple functions in succession', () => {
  const doubleSay = (s: string) => s + ', ' + s
  const capitalize = (s: string) => s[0].toUpperCase() + s.substring(1)
  const exclaim = (s: string) => s + '!'

  const result = pipe('hello').map(doubleSay).map(capitalize).map(exclaim)

  expect(result.value).toBe('Hello, hello!')
})
