import { matcherHint, printReceived } from 'jest-matcher-utils'
import { Either } from 'fp-ts/lib/Either'
import { whereMatch } from './predicates'
import { printReceivedRight } from './print'

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchRight(expected: any): R
    }
  }
}

const passMessage = <R>(actual: Either<any, R>, expected: Partial<R>) => () =>
  matcherHint('.not.toMatchRight', 'received', 'rightMatch') +
  '\n\n' +
  'Expected Either not to match right:\n' +
  `  ${printReceived(expected)}` +
  '\n\n' +
  printReceivedRight(actual)

const failMessage = <R>(actual: Either<any, R>, expected: Partial<R>) => () =>
  matcherHint('.toMatchRight', 'received', 'rightMatch') +
  '\n\n' +
  'Expected Either to match right:\n' +
  `  ${printReceived(expected)}` +
  '\n\n' +
  printReceivedRight(actual)

export function toMatchRight<R>(actual: Either<any, R>, expected: Partial<R>) {
  const pass = actual.fold(() => false, whereMatch(expected))
  return {
    actual,
    expected,
    pass,
    message: pass
      ? passMessage(actual, expected)
      : failMessage(actual, expected)
  }
}
