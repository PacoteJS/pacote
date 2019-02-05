import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src'

expect.extend(matchers)

describe('.toBeLeft()', () => {
  test('passes when object is a left', () => {
    expect(left('left')).toBeLeft()
  })

  test('fails when object is a right', () => {
    expect(() =>
      expect(right('right')).toBeLeft()
    ).toThrowErrorMatchingSnapshot()
  })
})

describe('.not.toBeLeft()', () => {
  test('passes when object is a right', () => {
    expect(right('right')).not.toBeLeft()
  })

  test('fails when object is a left', () => {
    expect(() =>
      expect(left('left')).not.toBeLeft()
    ).toThrowErrorMatchingSnapshot()
  })
})
