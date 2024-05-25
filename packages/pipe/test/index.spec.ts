import { assert, anything, func, property } from 'fast-check'
import { describe, expect, it, test } from 'vitest'
import { flow, pipe } from '../src/index'

describe('pipe', () => {
  it('takes any value', () => {
    assert(
      property(anything(), (value) => {
        const result = pipe(value)
        expect(result).toEqual(value)
      }),
    )
  })

  it('maps a function over the stored value', () => {
    const value = 2
    const double = (i: number) => i * 2

    const result = pipe(value, double)

    expect(result).toBe(4)
  })

  it('maps multiple functions in succession', () => {
    const doubleSay = (s: string) => `${s}, ${s}`
    const capitalize = (s: string) => s[0].toUpperCase() + s.substring(1)
    const exclaim = (s: string) => `${s}!`

    const result = pipe('hello', doubleSay, capitalize, exclaim)

    expect(result).toBe('Hello, hello!')
  })

  describe('functor laws', () => {
    test('identity', () => {
      assert(
        property(anything(), (value) => {
          expect(pipe(value, (i) => i)).toEqual(value)
        }),
      )
    })

    test('composition', () => {
      assert(
        property(
          func(anything()),
          func(anything()),
          anything(),
          (f, g, value) => {
            expect(pipe(value, f, g)).toEqual(g(f(value)))
          },
        ),
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
    const doubleSay = (s: string) => `${s}, ${s}`
    const capitalize = (s: string) => s[0].toUpperCase() + s.substring(1)
    const exclaim = (s: string) => `${s}!`

    const fn = flow(doubleSay, capitalize, exclaim)

    expect(fn('hello')).toBe('Hello, hello!')
  })
})
