// eslint-disable export

import { matcherHint, printExpected } from 'jest-matcher-utils'
import { Either } from 'fp-ts/lib/Either'
import { matchObject, matchString, leftPredicate } from './shared/predicates'
import { printReceivedLeft } from './shared/print'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toMatchLeft(expected: any): R
    }
  }
}

const passMessage = <L>(
  actual: Either<L, any>,
  expected: RegExp | Partial<L>
) => () =>
  matcherHint('.not.toMatchLeft', 'received', 'expectedLeft') +
  '\n\n' +
  'Expected Either not to match left:\n' +
  `  ${printExpected(expected)}` +
  '\n\n' +
  printReceivedLeft(actual)

const failMessage = <L>(
  actual: Either<L, any>,
  expected: RegExp | Partial<L>
) => () =>
  matcherHint('.toMatchLeft', 'received', 'expectedLeft') +
  '\n\n' +
  'Expected Either to match left:\n' +
  `  ${printExpected(expected)}` +
  '\n\n' +
  printReceivedLeft(actual)

export function toMatchLeft(actual: Either<string, any>, expected: RegExp): any
export function toMatchLeft<L>(
  actual: Either<L, any>,
  expected: Partial<L>
): any
export function toMatchLeft<L>(
  actual: Either<L, any>,
  expected: RegExp | Partial<L>
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
