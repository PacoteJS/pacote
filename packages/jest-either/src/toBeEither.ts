import { matcherHint, printReceived } from 'jest-matcher-utils'
import { isNil } from 'ramda'
import { Either } from 'fp-ts/lib/Either'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEither(): R
    }
  }
}

function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

function predicate(actual: any): actual is Either<any, any> {
  return (
    !isNil(actual) && isFunction(actual.isLeft) && isFunction(actual.isRight)
  )
}

const passMessage = (actual: any) => () =>
  matcherHint('.not.toBeEither', 'received', '') +
  '\n\n' +
  'Unexpected Either, received:\n' +
  `  ${printReceived(actual)}`

const failMessage = (actual: any) => () =>
  matcherHint('.toBeEither', 'received', '') +
  '\n\n' +
  'Expected Either, received:\n' +
  `  ${printReceived(actual)}`

export function toBeEither(actual: any) {
  const pass = predicate(actual)
  return {
    pass,
    message: pass ? passMessage(actual) : failMessage(actual)
  }
}
