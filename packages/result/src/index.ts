import { None, type Option, Some } from '@pacote/option'

export const T_OK = Symbol('Ok')
export const T_ERR = Symbol('Err')

/**
 * Successful result type.
 *
 * @typeParam T Sucess value type.
 */
export interface Ok<T> {
  readonly type: typeof T_OK
  readonly value: T
}

/**
 * Error result type.
 *
 * @typeParam E Error type.
 */
export interface Err<E> {
  readonly type: typeof T_ERR
  readonly value: E
}

/**
 * Result type.
 *
 * @typeParam T Sucess value type.
 * @typeParam E Error type.
 */
export type Result<T, E> = Ok<T> | Err<E>

/**
 * Wraps a success value in a `Result`.
 *
 * @param value Value to wrap.
 *
 * @returns Successful result.
 *
 * @category Constructors
 */
export function Ok<T>(value: T): Result<T, never> {
  return {
    type: T_OK,
    value,
  }
}

/**
 * Wraps an error value in a `Result`.
 *
 * @param value Error to wrap.
 *
 * @returns Error result.
 *
 * @category Constructors
 */
export function Err<E>(value: E): Result<never, E> {
  return {
    type: T_ERR,
    value,
  }
}

/**
 * Checks whether a result is a success.
 *
 * @param   value Result to evaluate.
 *
 * @returns       Returns `true` if the passed result is `Ok`. Otherwise, it
 *                returns `false`.
 */
export function isOk<T, E>(value: Result<T, E>): value is Ok<T> {
  return value.type === T_OK
}

/**
 * Checks whether a result is an error.
 *
 * @param   value Result to evaluate.
 *
 * @returns       Returns `true` if the passed result is `Err`. Otherwise, it
 *                returns `false`.
 */
export function isErr<T, E>(value: Result<T, E>): value is Err<E> {
  return value.type === T_ERR
}

/**
 * Converts a `Result` into an `Option` wrapping the successful value.
 *
 * @param   result  Result to convert.
 *
 * @returns         `None` if the result is `Err`, or `Some` wrapping the
 *                  result value if it's `Ok`.
 */
export function ok<T, E>(result: Result<T, E>): Option<T> {
  return isOk(result) ? Some(result.value) : None
}

/**
 * Converts a `Result` into an `Option` wrapping the error value.
 *
 * @param   result  Result to convert.
 *
 * @returns         `None` if the result is `Ok`, or `Some` wrapping the
 *                  result error if it's `Err`.
 */
export function err<T, E>(result: Result<T, E>): Option<E> {
  return isErr(result) ? Some(result.value) : None
}

/**
 * Returns the value contained in the result.
 *
 * @param   fn  Function to evaluate if the result is an error.
 *
 * @returns     If the result is `Err`, it evaluates the provided function
 *              for an alternative.
 */
export function getOrElse<T, E>(
  fn: (err: E) => T,
): (result: Result<T, E>) => T {
  return (result) => (isOk(result) ? result.value : fn(result.value))
}

/**
 * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to the
 * contained value.
 *
 * @param   fn      Value mapping function.
 * @param   result  Result to map.
 * @returns         Mapped result value.
 */
export function map<T, E, U>(
  fn: (value: T) => U,
  result: Result<T, E>,
): Result<U, E> {
  return isOk(result) ? Ok(fn(result.value)) : result
}

/**
 * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to the
 * contained value.
 *
 * @param   fn      Error mapping function.
 * @param   result  Result to map.
 * @returns         Mapped result error.
 */
export function mapErr<T, E, F>(
  fn: (value: E) => F,
  result: Result<T, E>,
): Result<T, F> {
  return isErr(result) ? Err(fn(result.value)) : result
}

/**
 * Calls `fn` if the result is `Ok`, otherwise returns the `Err` value.
 *
 * @param   fn      Flat map function.
 * @param   result  Result to flat map.
 * @returns         Flat mapped result.
 */
export function flatMap<T, E, U>(
  fn: (value: T) => Result<U, E>,
  result: Result<T, E>,
): Result<U, E> {
  return isOk(result) ? fn(result.value) : result
}

/**
 * Maps a `Result<T, E>` to `Result<U, F>` by applying a pair of functions
 * over each of the possible results.
 *
 * @param   onOk    Value mapping function.
 * @param   onErr   Error mapping function.
 * @param   result  Result to map.
 * @returns         Mapped result.
 */
export function bimap<T, E, U, F>(
  onOk: (ok: T) => U,
  onErr: (err: E) => F,
  result: Result<T, E>,
): Result<U, F> {
  return isOk(result) ? Ok(onOk(result.value)) : Err(onErr(result.value))
}

/**
 * Flatten a nested `Result` by converting `Result<Result<T, E>, E>` to
 * `Result<T, E>`.
 *
 * @param   result  Result to flatten.
 * @returns         Flattened result.
 */
export function flatten<T, E>(result: Result<Result<T, E>, E>): Result<T, E> {
  return isOk(result) ? result.value : result
}

/**
 * Applies the `onOk` function to the value contained in `Ok`, otherwise it
 * computes a default using `onErr` if it is an error.
 *
 * @param   onOk    Value folding function.
 * @param   onErr   Error folding function.
 * @param   result  Result to fold.
 * @returns         Output of either the `onOk` or `onErr` functions.
 */
export function fold<T, E, R>(
  onOk: (ok: T) => R,
  onErr: (err: E) => R,
  result: Result<T, E>,
): R {
  return isOk(result) ? onOk(result.value) : onErr(result.value)
}

/**
 * Disjunction of two results.
 *
 * @param   alternative Alternative result.
 * @param   result      Result to evaluate.
 * @returns             Result if it is `Ok`, otherwise returns the
 *                      alternative.
 */
export function or<T, E>(
  alternative: Result<T, E>,
  result: Result<T, E>,
): Result<T, E> {
  return isOk(result) ? result : alternative
}

/**
 * Conjunction of two results.
 *
 * @param   alternative Alternative result.
 * @param   result      Result to evaluate.
 * @returns             Result if it is `Err`, otherwise returns the
 *                      alternative.
 */
export function and<T, E, U>(
  alternative: Result<U, E>,
  result: Result<T, E>,
): Result<U, E> {
  return isOk(result) ? alternative : result
}

/**
 * Creates a new instance of `Result` based on the value being passed.
 *
 * @typeParam T     Resolved type of the promise on success.
 * @typeParam E     Rejected type of the promise on failure.
 *
 * @param     error Error to wrap if the provided value is `null`.
 * @param     value Value to wrap, unless it's `null`.
 *
 * @returns         If `null` or `undefined`, it returns `Err(error)`.
 *                  Otherwise, it returns `Ok(value)`.
 *
 * @category Constructors
 */
export function ofNullable<T, E>(error: E, value: T): Result<T, E> {
  return value == null ? Err(error) : Ok(value)
}

/**
 * Creates a new instance of `Promise<Result<T, Error>>` based on whether
 * the provided promise resolves or not.
 *
 * @typeParam T       Resolved type of the promise on success.
 * @typeParam E       Rejected type of the promise on failure.
 *
 * @param     promise Unresolved promise.
 *
 * @returns           If it resolves, a `Promise` of `Ok` with the resolved
 *                    value is returned. Otherwise, a `Promise` of `Err` with
 *                    the rejection error is returned. In either case, the
 *                    newly returned promise will always resolve.
 *
 * @category Constructors
 */
export function ofPromise<T, E extends Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  return promise.then(Ok).catch(Err)
}

/**
 * Creates a new instance of `Result<T, Error>` based on the result of a
 * function `fn` that might throw an exception.
 *
 * @typeParam T   Return type of the function being evaluated.
 *
 * @param     fn  Function to evaluate.
 *
 * @returns       If an exception is thrown, an `Err` with the thrown error
 *                is returned. Otherwise, an `Ok` with the result of calling
 *                `fn`.
 *
 * @category Constructors
 */
export function tryCatch<T, E = unknown>(fn: () => T): Result<T, E> {
  try {
    return Ok(fn())
  } catch (error) {
    return Err(error as E)
  }
}
