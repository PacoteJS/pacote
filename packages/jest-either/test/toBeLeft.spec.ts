import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src'

expect.extend(matchers)

describe('.toBeLeft()', () => {
  test('passes when object is a left', () => {
    expect(left(true)).toBeLeft()
  })

  test('fails when object is a right', () => {
    expect(() => expect(right(true)).toBeLeft()).toThrowErrorMatchingSnapshot()
  })
})

describe('.not.toBeLeft()', () => {
  test('passes when object is a right', () => {
    expect(right(true)).not.toBeLeft()
  })

  test('fails when object is a left', () => {
    expect(() =>
      expect(left(false)).not.toBeLeft()
    ).toThrowErrorMatchingSnapshot()
  })
})
