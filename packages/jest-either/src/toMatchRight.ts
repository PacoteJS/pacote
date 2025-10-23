import type { Either } from 'fp-ts/lib/Either'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'
import {
  type AsymmetricMatcher,
  isAsymmetricMatcher,
  matchObject,
  matchString,
  rightPredicate,
} from './shared/predicates'
import { printReceivedRight } from './shared/print'
import { isEither } from './shared/isEither'
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
