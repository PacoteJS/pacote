import { matcherHint, printExpected } from 'jest-matcher-utils'
import { Either } from 'fp-ts/lib/Either'
import { equals } from 'ramda'
import { diffReceivedLeft } from './shared/print'
import {
  AsymmetricMatcher,
  isAsymmetricMatcher,
  leftPredicate,
} from './shared/predicates'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toEqualLeft(expected: any): R
    }
  }
}

const passMessage =
  <L>(expected: L) =>
  () =>
    matcherHint('.not.toEqualLeft', 'received', 'expectedLeft') +
    '\n\n' +
    'Expected Either not to equal left:\n' +
    `  ${printExpected(expected)}` +
    '\n\n' +
    "But it's the same."

const failMessage =
  <L>(actual: Either<L, any>, expected: L) =>
  () => {
    return (
      matcherHint('.toEqualLeft', 'received', 'expectedLeft') +
      '\n\n' +
      diffReceivedLeft(actual, expected)
    )
  }

export function toEqualLeft<L>(
  actual: Either<L, any>,
  expected: L | AsymmetricMatcher,
) {
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
