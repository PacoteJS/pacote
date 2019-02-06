import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src'

expect.extend(matchers)

describe('.toEqualLeft()', () => {
  test('passes when object equals the left', () => {
    expect(left({ test: 'ok' })).toEqualLeft({ test: 'ok' })
  })

  test.skip('passes when object matches the left', () => {
    expect(left({ test: 'ok', more: 'ok' })).toEqualLeft(
      expect.objectContaining({ test: 'ok' })
    )
  })

  test('fails when object is not equal to the left', () => {
    expect(() =>
      expect(left({ test: 'ok' })).toEqualLeft('different')
    ).toThrowErrorMatchingSnapshot()
  })

  test('fails when object is a right', () => {
    expect(() =>
      expect(right('same')).toEqualLeft('same')
    ).toThrowErrorMatchingSnapshot()
  })
})

describe('.not.toEqualLeft()', () => {
  test('passes when object is a right', () => {
    expect(right('right')).not.toEqualLeft('left')
  })

  test('passes when object is not equal to the left', () => {
    expect(left({ test: 'ok' })).not.toEqualLeft('different')
  })

  test('fails when object equals the left', () => {
    expect(() =>
      expect(left('same')).not.toEqualLeft('same')
    ).toThrowErrorMatchingSnapshot()
  })

  test.skip('fails when object matches the left', () => {
    expect(() =>
      expect(left({ test: 'ok', more: 'ok' })).not.toEqualLeft(
        expect.objectContaining({ test: 'ok' })
      )
    ).toThrowErrorMatchingSnapshot()
  })
})
