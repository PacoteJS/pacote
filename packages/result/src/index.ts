import { Some, None, Option } from '@pacote/option'

interface Ok<T> {
  readonly type: symbol
  readonly value: T
}

interface Err<E> {
  readonly type: symbol
  readonly value: E
}

const Type = {
  Ok: Symbol('Ok'),
  Err: Symbol('Err'),
}

type Result<T, E> = Ok<T> | Err<E>

export function Ok<T>(value: T): Result<T, never> {
  return {
    type: Type.Ok,
    value,
  }
}

export function Err<E>(value: E): Result<never, E> {
  return {
    type: Type.Err,
    value,
  }
}

export function isOk<T, E>(value: Result<T, E>): value is Ok<T> {
  return value.type === Type.Ok
}

export function isErr<T, E>(value: Result<T, E>): value is Err<E> {
  return value.type === Type.Err
}

export function ok<T, E>(result: Result<T, E>): Option<T> {
  return isOk(result) ? Some(result.value) : None
}

export function err<T, E>(result: Result<T, E>): Option<E> {
  return isErr(result) ? Some(result.value) : None
}

export function getOrElse<T, E>(fn: (err: E) => T, result: Result<T, E>): T {
  return isOk(result) ? result.value : fn(result.value)
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
