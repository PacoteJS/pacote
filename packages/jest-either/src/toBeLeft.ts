import { isLeft } from 'fp-ts/lib/Either'
import { matcherHint, printReceived } from 'jest-matcher-utils'
import { isEither } from './shared/isEither'
import type { MatcherResult } from './shared/types'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeLeft(): R
    }
  }
}

const passMessage = () => () =>
  `${matcherHint(
    '.not.toBeLeft',
    'received',
    '',
  )}\n\nExpected Either not to be left, received left.`

const failMessage = () => () =>
  `${matcherHint(
    '.toBeLeft',
    'received',
    '',
  )}\n\nExpected Either to be left, received right.`

const notEitherMessage = (actual: unknown) => () =>
  `${matcherHint(
    '.toBeLeft',
    'received',
    '',
  )}\n\nExpected value to be an Either.\n  Received: ${printReceived(actual)}`

export function toBeLeft(actual: unknown): MatcherResult {
  if (!isEither(actual)) {
    return {
      pass: false,
      message: notEitherMessage(actual),
    }
  }

  const pass = isLeft(actual)
  return {
    pass,
    message: pass ? passMessage() : failMessage(),
  }
}
