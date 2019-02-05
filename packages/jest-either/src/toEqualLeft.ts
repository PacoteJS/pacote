import { matcherHint, printExpected } from 'jest-matcher-utils'
import { Either } from 'fp-ts/lib/Either'
import { equals } from 'ramda'
import { printReceivedLeft } from './print'

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualLeft(expected: any): R
    }
  }
}

const passMessage = <L, R>(received: Either<L, R>, expected: L) => () =>
  matcherHint('.not.toEqualLeft', 'received', 'expectedLeft') +
  '\n\n' +
  'Expected Either not to equal left:\n' +
  `  ${printExpected(expected)}` +
  '\n\n' +
  printReceivedLeft(received)

const failMessage = <L, R>(received: Either<L, R>, expected: L) => () =>
  matcherHint('.toEqualLeft', 'received', 'expectedLeft') +
  '\n\n' +
  'Expected Either to equal left:\n' +
  `  ${printExpected(expected)}` +
  '\n\n' +
  printReceivedLeft(received)

export function toEqualLeft<L, R>(received: Either<L, R>, expected: L) {
  const pass = received.fold(equals(expected), () => false)
  return {
    pass,
    message: pass
      ? passMessage(received, expected)
      : failMessage(received, expected)
  }
}
