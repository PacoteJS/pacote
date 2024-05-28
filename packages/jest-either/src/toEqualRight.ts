import type { Either } from 'fp-ts/lib/Either'
import { matcherHint, printExpected } from 'jest-matcher-utils'
import { equals } from 'ramda'
import {
  type AsymmetricMatcher,
  isAsymmetricMatcher,
  rightPredicate,
} from './shared/predicates'
import { diffReceivedRight } from './shared/print'

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

export function toEqualRight<R>(
  actual: Either<unknown, R>,
  expected: R | AsymmetricMatcher,
) {
  const predicate = isAsymmetricMatcher(expected)
    ? expected.asymmetricMatch.bind(expected)
    : equals(expected)

  const pass = rightPredicate(actual, predicate)

  return {
    actual,
    expected,
    pass,
    message: pass ? passMessage(expected) : failMessage(actual, expected),
  }
}
