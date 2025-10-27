import { isRight } from 'fp-ts/lib/Either'
import { matcherHint, printReceived } from 'jest-matcher-utils'
import { isEither } from './shared/isEither'
import type { MatcherResult } from './shared/types'

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

const notEitherMessage = (actual: unknown) => () =>
  `${matcherHint(
    '.toBeRight',
    'received',
    '',
  )}\n\nExpected value to be an Either.\n  Received: ${printReceived(actual)}`

/**
 * Asserts that the received `Either` is a `Right`.
 *
 * @example
 * ```typescript
 * import { left, right } from 'fp-ts/lib/Either'
 *
 * test('passes when Either is a right', () => {
 *   const actual = right({ test: 'ok' })
 *   expect(actual).toBeRight()
 * })
 *
 * test('passes when Either is a left', () => {
 *   const actual = left(Error())
 *   expect(actual).not.toBeRight()
 * })
 * ```
 */
export function toBeRight(actual: unknown): MatcherResult {
  if (!isEither(actual)) {
    return {
      pass: false,
      message: notEitherMessage(actual),
    }
  }

  const pass = isRight(actual)

  return {
    pass,
    message: pass ? passMessage() : failMessage(),
  }
}
