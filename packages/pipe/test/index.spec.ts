import { anything, assert, func, property } from 'fast-check'
import { pipe, flow } from '../src/index'

describe('pipe', () => {
  it('takes any value', () => {
    assert(
      property(anything(), (value) => {
        const result = pipe(value)
        expect(result.value).toEqual(value)
      })
    )
  })

  it('maps a function over the stored value', () => {
    const value = 2
    const double = (i: number) => i * 2

    const result = pipe(value).then(double)

    expect(result.value).toBe(4)
  })

  it('maps multiple functions in succession', () => {
    const doubleSay = (s: string) => s + ', ' + s
    const capitalize = (s: string) => s[0].toUpperCase() + s.substring(1)
    const exclaim = (s: string) => s + '!'

    const result = pipe('hello').then(doubleSay).then(capitalize).then(exclaim)

    expect(result.value).toBe('Hello, hello!')
  })

  describe('functor laws', () => {
    test('identity', () => {
      assert(
        property(anything(), (value) => {
          expect(pipe(value).then((i) => i).value).toEqual(value)
        })
      )
    })

    test('composition', () => {
      assert(
        property(
          func(anything()),
          func(anything()),
          anything(),
          (f, g, value) => {
            expect(pipe(value).then(f).then(g).value).toEqual(g(f(value)))
          }
        )
      )
    })
  })
})

describe('flow', () => {
  it('maps a function over the stored value', () => {
    const value = 2
    const double = (i: number) => i * 2

    const fn = flow(double)

    expect(fn(value)).toBe(4)
  })

  it('maps multiple functions in succession', () => {
    const doubleSay = (s: string) => s + ', ' + s
    const capitalize = (s: string) => s[0].toUpperCase() + s.substring(1)
    const exclaim = (s: string) => s + '!'

    const fn = flow(doubleSay).then(capitalize).then(exclaim)

    expect(fn('hello')).toBe('Hello, hello!')
  })
})
