import { matcherHint } from 'jest-matcher-utils'
import { Either } from 'fp-ts/lib/Either'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeLeft(): R
    }
  }
}

const passMessage = () => () =>
  matcherHint('.not.toBeLeft', 'received', '') +
  '\n\n' +
  'Expected Either not to be left, received left.'

const failMessage = () => () =>
  matcherHint('.toBeLeft', 'received', '') +
  '\n\n' +
  'Expected Either to be left, received right.'

export function toBeLeft(actual: Either<any, any>) {
  const pass = actual.isLeft()
  return {
    pass,
    message: pass ? passMessage() : failMessage()
  }
}
