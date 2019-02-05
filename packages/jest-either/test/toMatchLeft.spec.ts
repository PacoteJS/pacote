import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src'

expect.extend(matchers)

describe('.toMatchLeft()', () => {
  test('passes when object matches the left', () => {
    expect(left({ a: 1, b: 2 })).toMatchLeft({ a: 1 })
  })

  test('fails when object does not match the left', () => {
    expect(() =>
      expect(left({ a: 1, b: 2 })).toMatchLeft({ a: 2 })
    ).toThrowErrorMatchingSnapshot()
  })

  test('fails when object is a right', () => {
    expect(() =>
      expect(right({ a: 1 })).toMatchLeft({ a: 1 })
    ).toThrowErrorMatchingSnapshot()
  })
})

describe('.not.toMatchLeft()', () => {
  test('passes when object is a right', () => {
    expect(right('right')).not.toMatchLeft('left')
  })

  test('passes when object does not match the left', () => {
    expect(left({ a: 1, b: 2 })).not.toMatchLeft({ a: 2 })
  })

  test('fails when object matches the left', () => {
    expect(() =>
      expect(left({ a: 1 })).not.toMatchLeft({ a: 1 })
    ).toThrowErrorMatchingSnapshot()
  })
})
