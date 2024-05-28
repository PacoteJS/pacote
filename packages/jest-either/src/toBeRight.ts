import { type Either, isRight } from 'fp-ts/lib/Either'
import { matcherHint } from 'jest-matcher-utils'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeRight(): R
    }
  }
}

const passMessage = () => () =>
  `${matcherHint(
    '.not.toBeRight',
    'received',
    '',
  )}\n\nExpected Either not to be right, received right.`

const failMessage = () => () =>
  `${matcherHint(
    '.toBeRight',
    'received',
    '',
  )}\n\nExpected Either to be right, received left.`

export function toBeRight(actual: Either<unknown, unknown>) {
  const pass = isRight(actual)

  return {
    pass,
    message: pass ? passMessage() : failMessage(),
  }
}
