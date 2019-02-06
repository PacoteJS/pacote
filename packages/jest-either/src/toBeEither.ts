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

function predicate(received: any): received is Either<any, any> {
  return (
    !isNil(received) &&
    isFunction(received.isLeft) &&
    isFunction(received.isRight)
  )
}

const passMessage = (received: any) => () =>
  matcherHint('.not.toBeEither', 'received', '') +
  '\n\n' +
  'Unexpected Either, received:\n' +
  `  ${printReceived(received)}`

const failMessage = (received: any) => () =>
  matcherHint('.toBeEither', 'received', '') +
  '\n\n' +
  'Expected Either, received:\n' +
  `  ${printReceived(received)}`

export function toBeEither(received: any) {
  const pass = predicate(received)
  return {
    pass,
    message: pass ? passMessage(received) : failMessage(received)
  }
}
