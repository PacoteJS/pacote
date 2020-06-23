import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src'

expect.extend(matchers)

describe('.toMatchRight()', () => {
  test('passes when spec matches the object on the right', () => {
    expect(right({ a: 1, b: 2 })).toMatchRight({ a: 1 })
  })

  test('passes when spec deeply matches the object on the right', () => {
    expect(right({ a: 1, b: { c: [2], d: 3 } })).toMatchRight({ b: { c: [2] } })
  })

  test('passes when regular expression matches a string on the right', () => {
    expect(right('aa')).toMatchRight(/a/)
  })

  test('fails when spec does not match the object on the left', () => {
    expect(() => expect(right({ a: 1 })).toMatchRight({ a: 2 })).toThrowError()
  })

  test('fails when object is a left', () => {
    expect(() => expect(left({ a: 1 })).toMatchRight({ a: 1 })).toThrowError()
  })

  test('fails when regular expression does not match a string on the right', () => {
    expect(() => expect(right('aa')).toMatchRight(/b/)).toThrowError()
  })
})

describe('.not.toMatchRight()', () => {
  test('passes when object is a left', () => {
    expect(left({ a: 1 })).not.toMatchRight({ a: 1 })
  })

  test('passes when spec does not match the object on the right', () => {
    expect(right({ a: 1 })).not.toMatchRight({ a: 2 })
  })

  test('passes when regular expression does not match a string on the right', () => {
    expect(right('aa')).not.toMatchRight(/b/)
  })

  test('fails when spec deeply matches the object on the right', () => {
    expect(() =>
      expect(right({ a: 1, b: { c: 2, d: 3 } })).not.toMatchRight({
        b: { c: 2 },
      })
    ).toThrowError()
  })

  test('fails when spec matches the object on the right', () => {
    expect(() =>
      expect(right({ a: 1, b: 2 })).not.toMatchRight({ a: 1 })
    ).toThrowError()
  })

  test('fails when regular expression matches a string on the right', () => {
    expect(() => expect(right('aa')).not.toMatchRight(/a/)).toThrowError()
  })
})
