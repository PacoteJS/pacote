import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src'

expect.extend(matchers)

describe('.toBeRight()', () => {
  test('passes when object is a right', () => {
    expect(right('right')).toBeRight()
  })

  test('fails when object is a left', () => {
    expect(() =>
      expect(left('left')).toBeRight()
    ).toThrowErrorMatchingSnapshot()
  })
})

describe('.not.toBeRight()', () => {
  test('passes when object is a left', () => {
    expect(left('left')).not.toBeRight()
  })

  test('fails when object is a right', () => {
    expect(() =>
      expect(right('right')).not.toBeRight()
    ).toThrowErrorMatchingSnapshot()
  })
})
