import type { Either } from 'fp-ts/lib/Either'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'
import { isEither } from './shared/isEither'
import {
  type AsymmetricMatcher,
  isAsymmetricMatcher,
  matchObject,
  matchString,
  rightPredicate
} from './shared/predicates'
import { printReceivedRight } from './shared/print'
import type { MatcherResult } from './shared/types'

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchRight(expected: unknown): R
    }
  }
}

const passMessage =
  <R>(
    actual: Either<unknown, string | R>,
    expected: RegExp | Partial<R> | AsymmetricMatcher,
  ) =>
  () =>
    `${matcherHint(
      '.not.toMatchRight',
      'received',
      'rightMatch',
    )}\n\nExpected Either not to match right:\n  ${printExpected(
      expected,
    )}\n\n${printReceivedRight(actual)}`

const failMessage =
  <R>(
    actual: Either<unknown, string | R>,
    expected: RegExp | Partial<R> | AsymmetricMatcher,
  ) =>
  () =>
    `${matcherHint(
      '.toMatchRight',
      'received',
      'rightMatch',
    )}\n\nExpected Either to match right:\n  ${printExpected(
      expected,
    )}\n\n${printReceivedRight(actual)}`

const notEitherMessage = (expected: unknown, actual: unknown) => () =>
  `${matcherHint(
    '.toMatchRight',
    'received',
    'rightMatch',
  )}\n\nExpected value to be an Either.\n  Expected: ${printExpected(
    expected,
  )}\n  Received: ${printReceived(actual)}`

/**
 * Asserts that the right side of an `Either` matches a value, partial object,
 * or regular expression.
 *
 * @typeParam R Type of the right value contained in the `Either`.
 *
 * @param expected Pattern, partial object, or asymmetric matcher for the right.
 *
 * @example
 * ```typescript
 * import { right } from 'fp-ts/lib/Either'
 *
 * test('passes when right of Either matches an object', () => {
 *   const actual = right({ test: 'ok', foo: 'bar' })
 *   expect(actual).toMatchRight({ test: 'ok' })
 * })
 *
 * test('passes when right of Either does not match an object', () => {
 *   const actual = right({ test: 'unexpected', foo: 'bar' })
 *   expect(actual).not.toMatchRight({ test: 'ok' })
 * })
 * ```
 */
export function toMatchRight(
  actual: unknown,
  expected: RegExp | AsymmetricMatcher,
): MatcherResult
export function toMatchRight<R>(
  actual: unknown,
  expected: Partial<R> | AsymmetricMatcher,
): MatcherResult
export function toMatchRight<R>(
  actual: unknown,
  expected: RegExp | Partial<R> | AsymmetricMatcher,
): MatcherResult {
  if (!isEither(actual)) {
    return {
      expected,
      pass: false,
      message: notEitherMessage(expected, actual),
    }
  }

  const predicate =
    expected instanceof RegExp
      ? matchString(expected)
      : isAsymmetricMatcher(expected)
        ? expected.asymmetricMatch.bind(expected)
        : matchObject(expected)

  const pass = rightPredicate(actual, predicate)

  return {
    actual,
    expected,
    pass,
    message: pass
      ? passMessage(actual, expected)
      : failMessage(actual, expected),
  }
}
