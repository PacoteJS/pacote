import { matcherHint, printReceived } from 'jest-matcher-utils'
import { Either } from 'fp-ts/lib/Either'
import { equals } from 'ramda'
import { printReceivedRight } from './print'

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualRight(expected: any): R
    }
  }
}

const passMessage = <R>(received: Either<any, R>, expected: R) => () =>
  matcherHint('.not.toEqualRight', 'received', 'expectedRight') +
  '\n\n' +
  'Expected Either not to equal right:\n' +
  `  ${printReceived(expected)}` +
  '\n\n' +
  printReceivedRight(received)

const failMessage = <R>(received: Either<any, R>, expected: R) => () =>
  matcherHint('.toEqualRight', 'received', 'expectedRight') +
  '\n\n' +
  'Expected Either to equal right:\n' +
  `  ${printReceived(expected)}` +
  '\n\n' +
  printReceivedRight(received)

export function toEqualRight<R>(received: Either<any, R>, expected: R) {
  const pass = received.fold(() => false, equals(expected))
  return {
    pass,
    message: pass
      ? passMessage(received, expected)
      : failMessage(received, expected)
  }
}
