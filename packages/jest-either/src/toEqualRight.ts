import type { Either } from 'fp-ts/lib/Either.js'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'
import { isEither } from './shared/isEither.js'
import {
  type AsymmetricMatcher,
  isAsymmetricMatcher,
  rightPredicate,
} from './shared/predicates.js'
import { diffReceivedRight } from './shared/print.js'
import type { MatcherContext, MatcherResult } from './shared/types.js'

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualRight(expected: unknown): R
    }
  }
}

const passMessage =
  <R>(expected: R) =>
  () =>
    `${matcherHint(
      '.not.toEqualRight',
      'received',
      'expectedRight',
    )}\n\nExpected Either not to equal right:\n  ${printExpected(
      expected,
    )}\n\nBut it's the same.`

const failMessage =
  <R>(actual: Either<unknown, R>, expected: R) =>
  () =>
    `${matcherHint(
      '.toEqualRight',
      'received',
      'expectedRight',
    )}\n\n${diffReceivedRight(actual, expected)}`

const notEitherMessage = (expected: unknown, actual: unknown) => () =>
  `${matcherHint(
    '.toEqualRight',
    'received',
    'expectedRight',
  )}\n\nExpected value to be an Either.\n  Expected: ${printExpected(
    expected,
  )}\n  Received: ${printReceived(actual)}`

/**
 * Asserts that the right side of an `Either` equals an expected value or
 * asymmetric matcher.
 *
 * @typeParam R Type of the expected right value.
 *
 * @param expected Value or asymmetric matcher that should equal the right side.
 *
 * @example
 * ```typescript
 * import { right } from 'fp-ts/lib/Either'
 *
 * test('passes when right of Either equals a value', () => {
 *   const actual = right({ test: 'ok' })
 *   expect(actual).toEqualRight({ test: 'ok' })
 * })
 *
 * test('passes when right of Either does not equal a value', () => {
 *   const actual = right({ test: 'unexpected' })
 *   expect(actual).not.toEqualRight({ test: 'ok' })
 * })
 * ```
 */
export function toEqualRight<R>(
  this: MatcherContext,
  actual: unknown,
  expected: R | AsymmetricMatcher,
): MatcherResult {
  if (!isEither(actual)) {
    return {
      expected,
      pass: false,
      message: notEitherMessage(expected, actual),
    }
  }

  const predicate = isAsymmetricMatcher(expected)
    ? expected.asymmetricMatch.bind(expected)
    : (value: unknown) => this.equals(value, expected)

  const pass = rightPredicate(actual, predicate)

  return {
    actual,
    expected,
    pass,
    message: pass ? passMessage(expected) : failMessage(actual, expected),
  }
}
