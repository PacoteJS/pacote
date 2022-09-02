import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src/index'

expect.extend(matchers)

describe('.toEqualLeft()', () => {
  test('passes when object equals the left', () => {
    expect(left({ test: 'ok' })).toEqualLeft({ test: 'ok' })
  })

  test('fails when object does not equal the left', () => {
    expect(() =>
      expect(left({ test: 'ok' })).toEqualLeft('different')
    ).toThrow()
  })

  test('fails when object is a right', () => {
    expect(() => expect(right('same')).toEqualLeft('same')).toThrow()
  })

  test('passes when object equals the left using an asymmetric matcher', () => {
    expect(left({ test: 'ok', more: 'ok' })).toEqualLeft(
      expect.objectContaining({ test: 'ok' })
    )
  })

  test('fails when object does not equal the left using an asymmetric matcher', () => {
    expect(() =>
      expect(left({ test: 'ok' })).toEqualLeft(
        expect.objectContaining({ test: 'nok' })
      )
    ).toThrow()
  })
})

describe('.not.toEqualLeft()', () => {
  test('passes when object is a right', () => {
    expect(right('right')).not.toEqualLeft('left')
  })

  test('passes when object does not equal the left', () => {
    expect(left({ test: 'ok' })).not.toEqualLeft('different')
  })

  test('fails when object equals the left', () => {
    expect(() => expect(left('same')).not.toEqualLeft('same')).toThrow()
  })

  test('passes when object does not equal the left using an asymmetric matcher', () => {
    expect(left({ test: 'ok' })).not.toEqualLeft(
      expect.objectContaining({ test: 'nok' })
    )
  })

  test('fails when object equals the left using an asymmetric matcher', () => {
    expect(() =>
      expect(left({ test: 'ok', more: 'ok' })).not.toEqualLeft(
        expect.objectContaining({ test: 'ok' })
      )
    ).toThrow()
  })
})
