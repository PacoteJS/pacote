import { type Either, isLeft, isRight } from 'fp-ts/lib/Either'
import { matcherHint, printReceived } from 'jest-matcher-utils'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEither(): R
    }
  }
}

const passMessage = (actual: unknown) => () =>
  `${matcherHint(
    '.not.toBeEither',
    'received',
    '',
  )}\n\nUnexpected Either, received:\n  ${printReceived(actual)}`

const failMessage = (actual: unknown) => () =>
  `${matcherHint(
    '.toBeEither',
    'received',
    '',
  )}\n\nExpected Either, received:\n  ${printReceived(actual)}`

// biome-ignore lint/suspicious/noExplicitAny: receives anything
function isEither(actual: any): actual is Either<unknown, unknown> {
  return (
    actual !== undefined &&
    actual !== null &&
    (isLeft(actual) === true || isRight(actual) === true)
  )
}

export function toBeEither(actual: unknown) {
  const pass = isEither(actual)
  return {
    pass,
    message: pass ? passMessage(actual) : failMessage(actual),
  }
}
