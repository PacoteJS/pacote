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

const passMessage = <L>(received: Either<L, any>, expected: Partial<L>) => () =>
  matcherHint('.not.toMatchLeft', 'received', 'expectedLeft') +
  '\n\n' +
  'Expected Either not to match left:\n' +
  `  ${printExpected(expected)}` +
  '\n\n' +
  printReceivedLeft(received)

const failMessage = <L>(received: Either<L, any>, expected: Partial<L>) => () =>
  matcherHint('.toMatchLeft', 'received', 'expectedLeft') +
  '\n\n' +
  'Expected Either to match left:\n' +
  `  ${printExpected(expected)}` +
  '\n\n' +
  printReceivedLeft(received)

export function toMatchLeft<L>(received: Either<L, any>, expected: Partial<L>) {
  const pass = received.fold(whereEq(expected), () => false)
  return {
    pass,
    message: pass
      ? passMessage(received, expected)
      : failMessage(received, expected)
  }
}
