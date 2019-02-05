import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src'

expect.extend(matchers)

describe('.toEqualLeft()', () => {
  test('passes when object is a left', () => {
    expect(left({ a: { b: 'left' } })).toEqualLeft({ a: { b: 'left' } })
  })

  test('fails when object is not equal', () => {
    expect(() =>
      expect(left({ a: { b: 'left' } })).toEqualLeft('wrong')
    ).toThrowErrorMatchingSnapshot()
  })

  test('fails when object is a right', () => {
    expect(() =>
      expect(right('right')).toEqualLeft('right')
    ).toThrowErrorMatchingSnapshot()
  })
})

describe('.not.toEqualLeft()', () => {
  test('passes when object is a right', () => {
    expect(right('right')).not.toEqualLeft('left')
  })

  test('passes when object is not equal', () => {
    expect(left({ a: { b: 'left' } })).not.toEqualLeft('wrong')
  })

  test('fails when object is a left', () => {
    expect(() =>
      expect(left('left')).not.toEqualLeft('left')
    ).toThrowErrorMatchingSnapshot()
  })
})
