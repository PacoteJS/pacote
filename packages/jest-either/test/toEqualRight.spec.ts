import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src'

expect.extend(matchers)

describe('.toEqualRight()', () => {
  test('passes when object is a right', () => {
    expect(right({ a: { b: 'right' } })).toEqualRight({ a: { b: 'right' } })
  })

  test('fails when object is not equal', () => {
    expect(() =>
      expect(right({ a: { b: 'right' } })).toEqualRight('wrong')
    ).toThrowErrorMatchingSnapshot()
  })

  test('fails when object is a left', () => {
    expect(() =>
      expect(left('left')).toEqualRight('left')
    ).toThrowErrorMatchingSnapshot()
  })
})

describe('.not.toEqualRight()', () => {
  test('passes when object is a left', () => {
    expect(left('left')).not.toEqualRight('left')
  })

  test('passes when object is not equal', () => {
    expect(right({ a: { b: 'right' } })).not.toEqualRight('wrong')
  })

  test('fails when object is a right', () => {
    expect(() =>
      expect(right('right')).not.toEqualRight('right')
    ).toThrowErrorMatchingSnapshot()
  })
})
