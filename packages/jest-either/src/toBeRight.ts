import { type Either, isRight } from 'fp-ts/lib/Either'
import { matcherHint } from 'jest-matcher-utils'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
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

export function toBeRight(actual: Either<any, any>) {
  const pass = isRight(actual)

  return {
    pass,
    message: pass ? passMessage() : failMessage(),
  }
}
