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
