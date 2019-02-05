import { Either } from 'fp-ts/lib/Either'
import { printReceived } from 'jest-matcher-utils'

export function printReceivedLeft(either: Either<any, any>): string {
  return either.fold(
    left => `Received left:` + '\n' + `  ${printReceived(left)}`,
    () => `Received right.`
  )
}

export function printReceivedRight(either: Either<any, any>): string {
  return either.fold(
    () => `Received left.`,
    right => `Received right:` + '\n' + `  ${printReceived(right)}`
  )
}
