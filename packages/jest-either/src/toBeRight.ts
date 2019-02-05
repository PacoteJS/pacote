import { matcherHint } from 'jest-matcher-utils'
import { Either } from 'fp-ts/lib/Either'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeRight(): R
    }
  }
}

const passMessage = () => () =>
  matcherHint('.not.toBeRight', 'received', '') +
  '\n\n' +
  'Expected Either not to be right received right.'

const failMessage = () => () =>
  matcherHint('.toBeRight', 'received', '') +
  '\n\n' +
  'Expected Either to be right, received left.'

export function toBeRight(received: Either<any, any>) {
  const pass = received.isRight()
  return {
    pass,
    message: pass ? passMessage() : failMessage()
  }
}
