import { pipe } from 'fp-ts/function'
import { type Either, fold } from 'fp-ts/lib/Either'
import { diff } from 'jest-diff'
import { printExpected, printReceived } from 'jest-matcher-utils'

export function printReceivedLeft(actual: Either<unknown, unknown>): string {
  return pipe(
    actual,
    fold(
      (left) => `Received left:\n  ${printReceived(left)}`,
      () => 'Received right.',
    ),
  )
}

export function printReceivedRight(actual: Either<unknown, unknown>): string {
  return pipe(
    actual,
    fold(
      () => 'Received left.',
      (right) => `Received right:\n  ${printReceived(right)}`,
    ),
  )
}

export function diffReceivedLeft(
  actual: Either<unknown, unknown>,
  expected: unknown,
): string {
  return pipe(
    actual,
    fold(
      (left) => {
        const diffString = diff(expected, left) || ''
        return diffString.includes('- Expect')
          ? `Difference from Left:\n\n${diffString}`
          : `Expected Either to equal left:\n  ${printExpected(
              expected,
            )}\n\n${printReceivedLeft(actual)}`
      },
      () =>
        `Expected Either to equal left:\n  ${printExpected(
          expected,
        )}\n\n${printReceivedLeft(actual)}`,
    ),
  )
}

export function diffReceivedRight(
  actual: Either<unknown, unknown>,
  expected: unknown,
): string {
  return pipe(
    actual,
    fold(
      () =>
        `Expected Either to equal right:\n  ${printExpected(
          expected,
        )}\n\n${printReceivedRight(actual)}`,
      (right) => {
        const diffString = diff(expected, right) || ''
        return diffString.includes('- Expect')
          ? `Difference from Right:\n\n${diffString}`
          : `Expected Either to equal right:\n  ${printExpected(
              expected,
            )}\n\n${printReceivedRight(actual)}`
      },
    ),
  )
}
