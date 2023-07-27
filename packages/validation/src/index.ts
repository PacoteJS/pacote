import { NonEmptyArray, concat, fromElements } from '@pacote/non-empty-array'
import { Result, isErr, and, mapErr } from '@pacote/result'

/**
 * Validation data type.
 *
 * @typeParam T Validated value type.
 * @typeParam E Validation error type.
 */
export type Validation<T, E> = Result<T, NonEmptyArray<E>>

/**
 * Combinator which turns a function that returns a `Result<T, E>`
 * (with a single error) into one that returns a `Validation<T, E>` (with an
 * array containting one or more errors).
 *
 * @param check Function to lift.
 *
 * @returns Lifted function.
 */
export function lift<T, E>(
  check: (value: unknown) => Result<T, E>,
): (value: unknown) => Validation<T, E> {
  return (value) => mapErr(fromElements, check(value))
}

const prepend =
  <E>(before: readonly E[]) =>
  (after: NonEmptyArray<E>) =>
    concat(before, after)

const getErr = <E>(result: Validation<unknown, E>) =>
  isErr(result) ? result.value : []

const tupleSequence = <T, E>(results: readonly Validation<T, E>[]) =>
  results.reduce((previous, result) =>
    and(previous, mapErr(prepend(getErr(previous)), result)),
  )

/**
 * Composes multiple check functions (which take a value of type `T` and
 * return a `Validation<T, NonEmptyArray<E>>`) and returns a single function
 * that executes the check functions in sequence, and accumulates all
 * obtained errors into a `NonEmptyArray`.
 *
 * If no check functions fail, the composed validation function returns
 * `Ok` with the originally passed value.
 *
 * @param checks List of validation functions.
 *
 * @returns Validation function.
 */
export function validation<T, E>(
  ...checks: readonly ((value: unknown) => Validation<T, E>)[]
): (value: T) => Validation<T, E> {
  return (value) => tupleSequence(checks.map((check) => check(value)))
}
