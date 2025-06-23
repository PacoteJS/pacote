import type { Either } from 'fp-ts/lib/Either'
import { matcherHint, printExpected } from 'jest-matcher-utils'
import { leftPredicate, matchObject, matchString } from './shared/predicates'
import { printReceivedLeft } from './shared/print'

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchLeft(expected: unknown): R
    }
  }
}

const passMessage =
  <L>(actual: Either<L, unknown>, expected: RegExp | Partial<L>) =>
  () =>
    `${matcherHint(
      '.not.toMatchLeft',
      'received',
      'expectedLeft',
    )}\n\nExpected Either not to match left:\n  ${printExpected(
      expected,
    )}\n\n${printReceivedLeft(actual)}`

const failMessage =
  <L>(actual: Either<L, unknown>, expected: RegExp | Partial<L>) =>
  () =>
    `${matcherHint(
      '.toMatchLeft',
      'received',
      'expectedLeft',
    )}\n\nExpected Either to match left:\n  ${printExpected(
      expected,
    )}\n\n${printReceivedLeft(actual)}`

export function toMatchLeft(
  actual: Either<string, unknown>,
  expected: RegExp,
): unknown
export function toMatchLeft<L>(
  actual: Either<L, unknown>,
  expected: Partial<L>,
): unknown
export function toMatchLeft<L>(
  actual: Either<L, unknown>,
  expected: RegExp | Partial<L>,
) {
  const predicate =
    expected instanceof RegExp ? matchString(expected) : matchObject(expected)

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
