import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src/index'

expect.extend(matchers)

describe('.toBeEither()', () => {
  test('passes when object is a left', () => {
    expect(left(true)).toBeEither()
  })

  test('passes when object is a right', () => {
    expect(right(true)).toBeEither()
  })

  test('fails when object is undefined', () => {
    expect(() => expect(undefined).toBeEither()).toThrow()
  })

  test('fails when object is not an Either', () => {
    expect(() => expect(true).toBeEither()).toThrow()
  })
})

describe('.not.toBeEither()', () => {
  test('passes when object is not an Either', () => {
    expect(true).not.toBeEither()
  })

  test('passes when object is undefined', () => {
    expect(undefined).not.toBeEither()
  })

  test('fails when object is a left', () => {
    expect(() => expect(left(false)).not.toBeEither()).toThrow()
  })

  test('fails when object is a right', () => {
    expect(() => expect(right(false)).not.toBeEither()).toThrow()
  })
})
