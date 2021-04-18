import { NonEmptyArray, concat, fromElements } from '@pacote/non-empty-array'
import { Result, Ok, isErr, and, mapErr } from '@pacote/result'
import { pipe } from '@pacote/pipe'

export type Validation<T, E> = Result<T, NonEmptyArray<E>>

export function lift<T, E>(
  check: (value: T) => Result<T, E>
): (value: T) => Validation<T, E> {
  return (value) => pipe(check(value), mapErr(fromElements))
}

const getErr = <T, E>(result: Validation<T, E>): readonly E[] =>
  isErr(result) ? result.value : []

export function validation<T, E>(
  ...checks: ((value: T) => Validation<T, E>)[]
): (value: T) => Validation<T, E> {
  return (value) =>
    checks.reduce<Validation<T, E>>(
      (previous, check) =>
        pipe(
          check(value),
          mapErr((errors) => concat(getErr(previous), errors)),
          and(previous)
        ),
      Ok(value)
    )
}
