import { matcherHint, printExpected } from 'jest-matcher-utils'
import { Either } from 'fp-ts/lib/Either'
import { equals } from 'ramda'
import { diffReceivedRight } from './print'

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualRight(expected: any): R
    }
  }
}

const passMessage = <R>(actual: Either<any, R>, expected: R) => () =>
  matcherHint('.not.toEqualRight', 'received', 'expectedRight') +
  '\n\n' +
  'Expected Either not to equal right:\n' +
  `  ${printExpected(expected)}` +
  '\n\n' +
  "But it's the same."

const failMessage = <R>(actual: Either<any, R>, expected: R) => () =>
  matcherHint('.toEqualRight', 'received', 'expectedRight') +
  '\n\n' +
  diffReceivedRight(actual, expected)

export function toEqualRight<R>(actual: Either<any, R>, expected: R) {
  const pass = actual.fold(() => false, equals(expected))
  return {
    actual,
    expected,
    pass,
    message: pass
      ? passMessage(actual, expected)
      : failMessage(actual, expected)
  }
}
