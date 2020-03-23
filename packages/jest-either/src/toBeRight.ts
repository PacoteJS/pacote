import { matcherHint } from 'jest-matcher-utils'
import { Either, isRight } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toBeRight(): R
    }
  }
}

const passMessage = () => () =>
  matcherHint('.not.toBeRight', 'received', '') +
  '\n\n' +
  'Expected Either not to be right, received right.'

const failMessage = () => () =>
  matcherHint('.toBeRight', 'received', '') +
  '\n\n' +
  'Expected Either to be right, received left.'

export function toBeRight(actual: Either<any, any>) {
  const pass = pipe(actual, isRight)

  return {
    pass,
    message: pass ? passMessage() : failMessage(),
  }
}
