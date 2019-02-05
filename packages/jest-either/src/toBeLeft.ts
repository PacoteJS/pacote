import { matcherHint, printReceived } from 'jest-matcher-utils'
import { Either, isLeft } from 'fp-ts/lib/Either'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeLeft(): R
    }
  }
}

const passMessage = <L, R>(received: Either<L, R>) => () =>
  matcherHint('.not.toBeLeft', 'received', '') +
  '\n\n' +
  'Expected Either not to be left received:\n' +
  `  ${printReceived(received.toString())}`

const failMessage = <L, R>(received: Either<L, R>) => () =>
  matcherHint('.toBeLeft', 'received', '') +
  '\n\n' +
  'Expected Either to be left received:\n' +
  `  ${printReceived(received.toString())}`

export function toBeLeft(received: Either<any, any>) {
  const pass = isLeft(received)
  return {
    pass,
    message: pass ? passMessage(received) : failMessage(received)
  }
}
