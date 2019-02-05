import { matcherHint, printReceived } from 'jest-matcher-utils'
import { Either, isRight } from 'fp-ts/lib/Either'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeRight(): R
    }
  }
}

const passMessage = <L, R>(received: Either<L, R>) => () =>
  matcherHint('.not.toBeRight', 'received', '') +
  '\n\n' +
  'Expected Either not to be right received:\n' +
  `  ${printReceived(received.toString())}`

const failMessage = <L, R>(received: Either<L, R>) => () =>
  matcherHint('.toBeRight', 'received', '') +
  '\n\n' +
  'Expected Either to be right received:\n' +
  `  ${printReceived(received.toString())}`

export function toBeRight(received: Either<any, any>) {
  const pass = isRight(received)
  return {
    pass,
    message: pass ? passMessage(received) : failMessage(received)
  }
}
