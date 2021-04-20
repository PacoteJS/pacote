import { NonEmptyArray, concat, fromElements } from '@pacote/non-empty-array'
import { Result, isErr, and, mapErr } from '@pacote/result'
import { pipe } from '@pacote/pipe'

export type Validation<T, E> = Result<T, NonEmptyArray<E>>

export function lift<T, E>(
  check: (value: T) => Result<T, E>
): (value: T) => Validation<T, E> {
  return (value) => pipe(check(value), mapErr(fromElements))
}

const prepend = <E>(before: readonly E[]) => (after: NonEmptyArray<E>) =>
  concat(before, after)

const getErr = <E>(result: Validation<unknown, E>) =>
  isErr(result) ? result.value : []

const tupleSequence = <T, E>(results: readonly Validation<T, E>[]) =>
  results.reduce((previous, result) =>
    pipe(result, mapErr(prepend(getErr(previous))), and(previous))
  )

export function validation<T, E>(
  ...checks: ((value: T) => Validation<T, E>)[]
): (value: T) => Validation<T, E> {
  return (value) => tupleSequence(checks.map((check) => check(value)))
}
