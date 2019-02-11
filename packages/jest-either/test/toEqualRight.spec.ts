import { left, right } from 'fp-ts/lib/Either'
import matchers from '../src'

expect.extend(matchers)

describe('.toEqualRight()', () => {
  test('passes when object equals the right', () => {
    expect(right({ test: 'ok' })).toEqualRight({ test: 'ok' })
  })

  test('fails when object is not equal to the right', () => {
    expect(() =>
      expect(right({ test: 'ok' })).toEqualRight('different')
    ).toThrowErrorMatchingSnapshot()
  })

  test('fails when object is a left', () => {
    expect(() =>
      expect(left('same')).toEqualRight('same')
    ).toThrowErrorMatchingSnapshot()
  })

  test('passes when object equals the right using an asymmetric matcher', () => {
    expect(right({ test: 'ok', more: 'ok' })).toEqualRight(
      expect.objectContaining({ test: 'ok' })
    )
  })

  test('fails when object does not equal the right using an asymmetric matcher', () => {
    expect(() =>
      expect(right({ test: 'ok' })).toEqualRight(
        expect.objectContaining({ test: 'nok' })
      )
    ).toThrowErrorMatchingSnapshot()
  })
})

describe('.not.toEqualRight()', () => {
  test('passes when object is a left', () => {
    expect(left('left')).not.toEqualRight('left')
  })

  test('passes when object is not equal to the right', () => {
    expect(right({ test: 'ok' })).not.toEqualRight('different')
  })

  test('fails when object equals the right', () => {
    expect(() =>
      expect(right('same')).not.toEqualRight('same')
    ).toThrowErrorMatchingSnapshot()
  })

  test('passes when object does not equal the right using an asymmetric matcher', () => {
    expect(right({ test: 'ok' })).not.toEqualRight(
      expect.objectContaining({ test: 'nok' })
    )
  })

  test('fails when object equals the right using an asymmetric matcher', () => {
    expect(() =>
      expect(right({ test: 'ok', more: 'ok' })).not.toEqualRight(
        expect.objectContaining({ test: 'ok' })
      )
    ).toThrowErrorMatchingSnapshot()
  })
})
