import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src'

expect.extend(matchers)

describe('.toBeEither()', () => {
  test('passes when object is a left', () => {
    expect(left(true)).toBeEither()
  })

  test('passes when object is a right', () => {
    expect(right(true)).toBeEither()
  })

  test('fails when object is undefined', () => {
    expect(() => expect(undefined).toBeEither()).toThrowError()
  })

  test('fails when object is not an Either', () => {
    expect(() => expect(true).toBeEither()).toThrowError()
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
    expect(() => expect(left(false)).not.toBeEither()).toThrowError()
  })

  test('fails when object is a right', () => {
    expect(() => expect(right(false)).not.toBeEither()).toThrowError()
  })
})
