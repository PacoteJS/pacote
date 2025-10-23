import { matcherHint, printReceived } from 'jest-matcher-utils'
import { isEither } from './shared/isEither'
import type { MatcherResult } from './shared/types'

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

export function toBeEither(actual: unknown): MatcherResult {
  const pass = isEither(actual)
  return {
    pass,
    message: pass ? passMessage(actual) : failMessage(actual),
  }
}
