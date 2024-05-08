import { describe, test, expect } from 'vitest'
import { None, Some } from '@pacote/option'
import { iff } from '../src/index'

describe(`when both consequent and alternative functions are provided`, () => {
  test(`calls consequent when predicate is satisfied`, () => {
    const actual = iff(
      true,
      () => 'consequent',
      () => 'alternative',
    )
    expect(actual).toBe('consequent')
  })

  test(`calls alternative when predicate fails`, () => {
    const actual = iff(
      false,
      () => 'consequent',
      () => 'alternative',
    )
    expect(actual).toBe('alternative')
  })
})

describe(`when only the consequent function is provided`, () => {
  test(`calls consequent when predicate is satisfied, yielding Some(type)`, () => {
    const actual = iff(true, () => 'consequent')
    expect(actual).toEqual(Some('consequent'))
  })

  test(`yields None when predicate fails and alternative is undefined`, () => {
    const actual = iff(false, () => 'consequent')
    expect(actual).toEqual(None)
  })
})
