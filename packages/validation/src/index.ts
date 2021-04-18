import { NonEmptyArray, concat, fromElements } from '@pacote/non-empty-array'
import { Ok, Result, isErr, flatMap, mapErr } from '@pacote/result'
import { pipe } from '@pacote/pipe'

export type Validation<T, E> = Result<T, NonEmptyArray<E>>

const getErr = <T, E>(result: Validation<T, E>) =>
  isErr(result) ? result.value : []

export function lift<T, E>(
  check: (value: T) => Result<T, E>
): (value: T) => Validation<T, E> {
  return (value) => pipe(check(value), mapErr(fromElements))
}

export function validation<T, E>(
  ...checks: ((value: T) => Validation<T, E>)[]
): (value: T) => Validation<T, E> {
  return (value) =>
    checks.reduce<Validation<T, E>>(
      (previous, check) =>
        pipe(
          check(value),
          mapErr((errors) => concat(getErr(previous), errors)),
          flatMap(() => previous)
        ),
      Ok(value)
    )
}
