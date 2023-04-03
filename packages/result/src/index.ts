import { Some, None, Option } from '@pacote/option'

const T_OK = Symbol('Ok')
const T_ERR = Symbol('Err')

export interface Ok<T> {
  readonly type: typeof T_OK
  readonly value: T
}

export interface Err<E> {
  readonly type: typeof T_ERR
  readonly value: E
}

export type Result<T, E> = Ok<T> | Err<E>

export function Ok<T>(value: T): Result<T, never> {
  return {
    type: T_OK,
    value,
  }
}

export function Err<E>(value: E): Result<never, E> {
  return {
    type: T_ERR,
    value,
  }
}

export function isOk<T, E>(value: Result<T, E>): value is Ok<T> {
  return value.type === T_OK
}

export function isErr<T, E>(value: Result<T, E>): value is Err<E> {
  return value.type === T_ERR
}

export function ok<T, E>(result: Result<T, E>): Option<T> {
  return isOk(result) ? Some(result.value) : None
}

export function err<T, E>(result: Result<T, E>): Option<E> {
  return isErr(result) ? Some(result.value) : None
}

export function getOrElse<T, E>(
  fn: (err: E) => T
): (result: Result<T, E>) => T {
  return (result) => (isOk(result) ? result.value : fn(result.value))
}

export function map<T, E, U>(
  fn: (value: T) => U,
  result: Result<T, E>
): Result<U, E> {
  return isOk(result) ? Ok(fn(result.value)) : result
}

export function mapErr<T, E, F>(
  fn: (value: E) => F,
  result: Result<T, E>
): Result<T, F> {
  return isErr(result) ? Err(fn(result.value)) : result
}

export function flatMap<T, E, U>(
  fn: (value: T) => Result<U, E>,
  result: Result<T, E>
): Result<U, E> {
  return isOk(result) ? fn(result.value) : result
}

export function bimap<T, E, U, F>(
  onOk: (ok: T) => U,
  onErr: (err: E) => F,
  result: Result<T, E>
): Result<U, F> {
  return isOk(result) ? Ok(onOk(result.value)) : Err(onErr(result.value))
}

export function flatten<T, E>(result: Result<Result<T, E>, E>): Result<T, E> {
  return isOk(result) ? result.value : result
}

export function fold<T, E, R>(
  onOk: (ok: T) => R,
  onErr: (err: E) => R,
  result: Result<T, E>
): R {
  return isOk(result) ? onOk(result.value) : onErr(result.value)
}

export function or<T, E>(
  alternative: Result<T, E>,
  result: Result<T, E>
): Result<T, E> {
  return isOk(result) ? result : alternative
}

export function and<T, E, U>(
  alternative: Result<U, E>,
  result: Result<T, E>
): Result<U, E> {
  return isOk(result) ? alternative : result
}

export function ofNullable<T, E>(error: E, value: T): Result<T, E> {
  return value == null ? Err(error) : Ok(value)
}

export function ofPromise<T, E extends Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  return promise.then(Ok).catch(Err)
}

export function tryCatch<T>(fn: () => T): Result<T, unknown> {
  try {
    return Ok(fn())
  } catch (error) {
    return Err(error)
  }
}
