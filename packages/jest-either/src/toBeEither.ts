import { matcherHint, printReceived } from 'jest-matcher-utils'
import { isEither } from './predicates'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEither(): R
    }
  }
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
  const pass = isEither(actual)
  return {
    pass,
    message: pass ? passMessage(actual) : failMessage(actual)
  }
}
