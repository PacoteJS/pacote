import { matcherHint, printExpected } from 'jest-matcher-utils'
import { Either } from 'fp-ts/lib/Either'
import { whereEq } from 'ramda'
import { printReceivedLeft } from './print'

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchLeft(expected: any): R
    }
  }
}

const passMessage = <L>(actual: Either<L, any>, expected: Partial<L>) => () =>
  matcherHint('.not.toMatchLeft', 'received', 'expectedLeft') +
  '\n\n' +
  'Expected Either not to match left:\n' +
  `  ${printExpected(expected)}` +
  '\n\n' +
  printReceivedLeft(actual)

const failMessage = <L>(actual: Either<L, any>, expected: Partial<L>) => () =>
  matcherHint('.toMatchLeft', 'received', 'expectedLeft') +
  '\n\n' +
  'Expected Either to match left:\n' +
  `  ${printExpected(expected)}` +
  '\n\n' +
  printReceivedLeft(actual)

export function toMatchLeft<L>(actual: Either<L, any>, expected: Partial<L>) {
  const pass = actual.fold(whereEq(expected), () => false)
  return {
    actual,
    expected,
    pass,
    message: pass
      ? passMessage(actual, expected)
      : failMessage(actual, expected)
  }
}
