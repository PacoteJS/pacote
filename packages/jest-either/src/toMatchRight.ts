import { matcherHint, printReceived } from 'jest-matcher-utils'
import { Either } from 'fp-ts/lib/Either'
import { whereEq } from 'ramda'
import { printReceivedRight } from './print'

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchRight(expected: any): R
    }
  }
}

const passMessage = <L, R>(
  received: Either<L, R>,
  expected: Partial<R>
) => () =>
  matcherHint('.not.toMatchRight', 'received', 'rightMatch') +
  '\n\n' +
  'Expected Either not to match right:\n' +
  `  ${printReceived(expected)}` +
  '\n\n' +
  printReceivedRight(received)

const failMessage = <L, R>(
  received: Either<L, R>,
  expected: Partial<R>
) => () =>
  matcherHint('.toMatchRight', 'received', 'rightMatch') +
  '\n\n' +
  'Expected Either to match right:\n' +
  `  ${printReceived(expected)}` +
  '\n\n' +
  printReceivedRight(received)

export function toMatchRight<L, R>(
  received: Either<L, R>,
  expected: Partial<R>
) {
  const pass = received.fold(() => false, whereEq(expected))
  return {
    pass,
    message: pass
      ? passMessage(received, expected)
      : failMessage(received, expected)
  }
}
