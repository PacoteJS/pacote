import { type Either, isLeft, isRight } from 'fp-ts/lib/Either'
import { matcherHint, printReceived } from 'jest-matcher-utils'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeEither(): R
    }
  }
}

const passMessage = (actual: any) => () =>
  `${matcherHint(
    '.not.toBeEither',
    'received',
    '',
  )}\n\nUnexpected Either, received:\n  ${printReceived(actual)}`

const failMessage = (actual: any) => () =>
  `${matcherHint(
    '.toBeEither',
    'received',
    '',
  )}\n\nExpected Either, received:\n  ${printReceived(actual)}`

function isEither(actual: any): actual is Either<any, any> {
  return (
    actual !== undefined &&
    actual !== null &&
    (isLeft(actual) === true || isRight(actual) === true)
  )
}

export function toBeEither(actual: any) {
  const pass = isEither(actual)
  return {
    pass,
    message: pass ? passMessage(actual) : failMessage(actual),
  }
}
