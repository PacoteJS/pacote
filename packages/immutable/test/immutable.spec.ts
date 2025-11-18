import { describe, expectTypeOf, it } from 'vitest'
import type { Immutable } from '../src/index'

describe('Immutable', () => {
  it('marks nested object properties as readonly', () => {
    type Actual = Immutable<{ foo: { bar: string } }>
    interface Expected {
      readonly foo: { readonly bar: string }
    }
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  it('transforms arrays into readonly arrays', () => {
    type Actual = Immutable<number[]>
    type Expected = readonly number[]
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  it('keeps tuple structure while wrapping entries', () => {
    type Actual = Immutable<[number, { label: string }]>
    type Expected = readonly [number, Readonly<{ label: string }>]
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  it('wraps map values with immutable variants', () => {
    type Actual = Immutable<Map<{ key: string }, { value: number }>>
    type Expected = ReadonlyMap<
      Readonly<{ key: string }>,
      Readonly<{ value: number }>
    >
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  it('wraps set values with immutable variants', () => {
    type Actual = Immutable<Set<{ id: string }>>
    type Expected = ReadonlySet<Readonly<{ id: string }>>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  it('leaves primitive values unchanged', () => {
    type Actual = Immutable<string>
    type Expected = string
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })
})
