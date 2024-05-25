import type { Either } from 'fp-ts/lib/Either'
import { matcherHint, printReceived } from 'jest-matcher-utils'
import { matchObject, matchString, rightPredicate } from './shared/predicates'
import { printReceivedRight } from './shared/print'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchRight(expected: any): R
    }
  }
}

const passMessage =
  <R>(actual: Either<any, string | R>, expected: RegExp | Partial<R>) =>
  () =>
    `${matcherHint(
      '.not.toMatchRight',
      'received',
      'rightMatch',
    )}\n\nExpected Either not to match right:\n  ${printReceived(
      expected,
    )}\n\n${printReceivedRight(actual)}`

const failMessage =
  <R>(actual: Either<any, string | R>, expected: RegExp | Partial<R>) =>
  () =>
    `${matcherHint(
      '.toMatchRight',
      'received',
      'rightMatch',
    )}\n\nExpected Either to match right:\n  ${printReceived(
      expected,
    )}\n\n${printReceivedRight(actual)}`

export function toMatchRight(actual: Either<any, string>, expected: RegExp): any
export function toMatchRight<R>(
  actual: Either<any, R>,
  expected: Partial<R>,
): any
export function toMatchRight<R>(
  actual: Either<any, string | R>,
  expected: RegExp | Partial<R>,
) {
  const predicate =
    expected instanceof RegExp ? matchString(expected) : matchObject(expected)

  const pass = rightPredicate(actual, predicate)

  return {
    actual,
    expected,
    pass,
    message: pass
      ? passMessage(actual, expected)
      : failMessage(actual, expected),
  }
}
