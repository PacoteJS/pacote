import type { Either } from 'fp-ts/lib/Either'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'
import { equals } from 'ramda'
import {
  type AsymmetricMatcher,
  isAsymmetricMatcher,
  leftPredicate,
} from './shared/predicates'
import { diffReceivedLeft } from './shared/print'
import { isEither } from './shared/isEither'
import type { MatcherResult } from './shared/types'

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualLeft(expected: unknown): R
    }
  }
}

const passMessage =
  <L>(expected: L) =>
  () =>
    `${matcherHint(
      '.not.toEqualLeft',
      'received',
      'expectedLeft',
    )}\n\nExpected Either not to equal left:\n  ${printExpected(
      expected,
    )}\n\nBut it's the same.`

const failMessage =
  <L>(actual: Either<L, unknown>, expected: L) =>
  () => {
    return `${matcherHint(
      '.toEqualLeft',
      'received',
      'expectedLeft',
    )}\n\n${diffReceivedLeft(actual, expected)}`
  }

const notEitherMessage = (expected: unknown, actual: unknown) => () =>
  `${matcherHint(
    '.toEqualLeft',
    'received',
    'expectedLeft',
  )}\n\nExpected value to be an Either.\n  Expected: ${printExpected(
    expected,
  )}\n  Received: ${printReceived(actual)}`

export function toEqualLeft<L>(
  actual: unknown,
  expected: L | AsymmetricMatcher,
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
    : equals(expected)

  const pass = leftPredicate(actual, predicate)

  return {
    actual,
    expected,
    pass,
    message: pass ? passMessage(expected) : failMessage(actual, expected),
  }
}
