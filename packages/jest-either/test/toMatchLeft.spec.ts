import { left, right } from 'fp-ts/lib/Either'
import { describe, expect, test } from 'vitest'
import matchers from '../src/index'

expect.extend(matchers)

describe('.toMatchLeft()', () => {
  test('passes when spec matches the object on the left', () => {
    expect(left({ a: 1, b: 2 })).toMatchLeft({ a: 1 })
  })

  test('passes when spec deeply matches the object on the left', () => {
    expect(left({ a: 1, b: { c: [2], d: 3 } })).toMatchLeft({ b: { c: [2] } })
  })

  test('passes when regular expression matches a string on the left', () => {
    expect(left('aa')).toMatchLeft(/a/)
  })

  test('passes when asymmetric matchers match the value on the left', () => {
    expect(left({ a: 'alpha', b: 2 })).toMatchLeft({
      a: expect.stringContaining('alp'),
      b: expect.any(Number),
    })
  })

  test('passes when asymmetric matcher matches a string on the left', () => {
    expect(left('alphabet')).toMatchLeft(expect.stringContaining('alpha'))
  })

  test('fails when spec does not match the object on the left', () => {
    expect(() => expect(left({ a: 1, b: 2 })).toMatchLeft({ a: 2 })).toThrow()
  })

  test('fails when object is a right', () => {
    expect(() => expect(right({ a: 1 })).toMatchLeft({ a: 1 })).toThrow()
  })

  test('fails when regular expression does not match a string on the left', () => {
    expect(() => expect(left('aa')).toMatchLeft(/b/)).toThrow()
  })

  test('fails when asymmetric matcher does not match the value on the left', () => {
    expect(() =>
      expect(left({ a: 'alpha' })).toMatchLeft({
        a: expect.stringContaining('beta'),
      }),
    ).toThrow()
  })
})

describe('.not.toMatchLeft()', () => {
  test('passes when object is a right', () => {
    expect(right('right')).not.toMatchLeft('left')
  })

  test('passes when spec does not match the object on the left', () => {
    expect(left({ a: 1, b: 2 })).not.toMatchLeft({ a: 2 })
  })

  test('passes when regular expression does not match a string on the left', () => {
    expect(left('aa')).not.toMatchLeft(/b/)
  })

  test('passes when asymmetric matcher does not match the value on the left', () => {
    expect(left({ a: 'alpha' })).not.toMatchLeft({
      a: expect.stringContaining('beta'),
    })
  })

  test('fails when spec deeply matches the object on the left', () => {
    expect(() =>
      expect(left({ a: 1, b: { c: 2, d: 3 } })).not.toMatchLeft({
        b: { c: 2 },
      }),
    ).toThrow()
  })

  test('fails when spec matches the object on the left', () => {
    expect(() => expect(left({ a: 1 })).not.toMatchLeft({ a: 1 })).toThrow()
  })

  test('fails when regular expression matches a string on the left', () => {
    expect(() => expect(left('aa')).not.toMatchLeft(/a/)).toThrow()
  })

  test('fails when asymmetric matcher matches the value on the left', () => {
    expect(() =>
      expect(left({ a: 'alpha' })).not.toMatchLeft({
        a: expect.stringContaining('alp'),
      }),
    ).toThrow()
  })
})
