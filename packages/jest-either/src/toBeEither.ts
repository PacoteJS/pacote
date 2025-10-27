import { matcherHint, printReceived } from 'jest-matcher-utils'
import { isEither } from './shared/isEither'
import type { MatcherResult } from './shared/types'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEither(): R
    }
  }
}

const passMessage = (actual: unknown) => () =>
  `${matcherHint(
    '.not.toBeEither',
    'received',
    '',
  )}\n\nUnexpected Either, received:\n  ${printReceived(actual)}`

const failMessage = (actual: unknown) => () =>
  `${matcherHint(
    '.toBeEither',
    'received',
    '',
  )}\n\nExpected Either, received:\n  ${printReceived(actual)}`

/**
 * Asserts that the received value is an `Either` instance.
 *
 * @example
 * ```typescript
 * import { left, right } from 'fp-ts/lib/Either'
 *
 * test('passes when value is an Either', () => {
 *   expect(left(true)).toBeEither()
 *   expect(right(true)).toBeEither()
 * })
 *
 * test('passes when value is not an Either', () => {
 *   expect(undefined).not.toBeEither()
 * })
 * ```
 */
export function toBeEither(actual: unknown): MatcherResult {
  const pass = isEither(actual)
  return {
    pass,
    message: pass ? passMessage(actual) : failMessage(actual),
  }
}
