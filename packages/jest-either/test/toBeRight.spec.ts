import { describe, test, expect } from 'vitest'
import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src/index'

expect.extend(matchers)

describe('.toBeRight()', () => {
  test('passes when object is a right', () => {
    expect(right('right')).toBeRight()
  })

  test('fails when object is a left', () => {
    expect(() => expect(left('left')).toBeRight()).toThrow()
  })
})

describe('.not.toBeRight()', () => {
  test('passes when object is a left', () => {
    expect(left('left')).not.toBeRight()
  })

  test('fails when object is a right', () => {
    expect(() => expect(right('right')).not.toBeRight()).toThrow()
  })
})
