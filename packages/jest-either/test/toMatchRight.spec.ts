import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src'

expect.extend(matchers)

describe('.toMatchRight()', () => {
  test('passes when object matches the right', () => {
    expect(right({ a: 1, b: 2 })).toMatchRight({ a: 1 })
  })

  test('fails when object does not match the left', () => {
    expect(() =>
      expect(right({ a: 1 })).toMatchRight({ a: 2 })
    ).toThrowErrorMatchingSnapshot()
  })

  test('fails when object is a left', () => {
    expect(() =>
      expect(left({ a: 1 })).toMatchRight({ a: 1 })
    ).toThrowErrorMatchingSnapshot()
  })
})

describe('.not.toMatchRight()', () => {
  test('passes when object is a left', () => {
    expect(left({ a: 1 })).not.toMatchRight({ a: 1 })
  })

  test('passes when object does not match the right', () => {
    expect(right({ a: 1 })).not.toMatchRight({ a: 2 })
  })

  test('fails when object matches the right', () => {
    expect(() =>
      expect(right({ a: 1, b: 2 })).not.toMatchRight({ a: 1 })
    ).toThrowErrorMatchingSnapshot()
  })
})
