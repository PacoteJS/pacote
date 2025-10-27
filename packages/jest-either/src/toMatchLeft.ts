import type { Either } from 'fp-ts/lib/Either'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'
import {
  type AsymmetricMatcher,
  isAsymmetricMatcher,
  leftPredicate,
  matchObject,
  matchString,
} from './shared/predicates'
import { printReceivedLeft } from './shared/print'
import { isEither } from './shared/isEither'
import type { MatcherResult } from './shared/types'

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchLeft(expected: unknown): R
    }
  }
}

const passMessage =
  <L>(
    actual: Either<L, unknown>,
    expected: RegExp | Partial<L> | AsymmetricMatcher,
  ) =>
  () =>
    `${matcherHint(
      '.not.toMatchLeft',
      'received',
      'expectedLeft',
    )}\n\nExpected Either not to match left:\n  ${printExpected(
      expected,
    )}\n\n${printReceivedLeft(actual)}`

const failMessage =
  <L>(
    actual: Either<L, unknown>,
    expected: RegExp | Partial<L> | AsymmetricMatcher,
  ) =>
  () =>
    `${matcherHint(
      '.toMatchLeft',
      'received',
      'expectedLeft',
    )}\n\nExpected Either to match left:\n  ${printExpected(
      expected,
    )}\n\n${printReceivedLeft(actual)}`

const notEitherMessage = (expected: unknown, actual: unknown) => () =>
  `${matcherHint(
    '.toMatchLeft',
    'received',
    'expectedLeft',
  )}\n\nExpected value to be an Either.\n  Expected: ${printExpected(
    expected,
  )}\n  Received: ${printReceived(actual)}`

/**
 * Asserts that the left side of an `Either` matches a value, partial object, or
 * regular expression.
 *
 * @typeParam L Type of the left value contained in the `Either`.
 *
 * @param expected Pattern, partial object, or asymmetric matcher for the left.
 *
 * @example
 * ```typescript
 * import { left } from 'fp-ts/lib/Either'
 *
 * test('passes when left of Either matches an object', () => {
 *   const actual = left({ test: 'ok', foo: 'bar' })
 *   expect(actual).toMatchLeft({ test: 'ok' })
 * })
 *
 * test('passes when left of Either does not match an object', () => {
 *   const actual = left({ test: 'unexpected', foo: 'bar' })
 *   expect(actual).not.toMatchLeft({ test: 'ok' })
 * })
 * ```
 */
export function toMatchLeft(
  actual: unknown,
  expected: RegExp | AsymmetricMatcher,
): MatcherResult
export function toMatchLeft<L>(
  actual: unknown,
  expected: Partial<L> | AsymmetricMatcher,
): MatcherResult
export function toMatchLeft<L>(
  actual: unknown,
  expected: RegExp | Partial<L> | AsymmetricMatcher,
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

  const pass = leftPredicate(actual, predicate)

  return {
    actual,
    expected,
    pass,
    message: pass
      ? passMessage(actual, expected)
      : failMessage(actual, expected),
  }
}
