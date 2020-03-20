interface None {
  readonly type: symbol
}

interface Some<T> {
  readonly type: symbol
  readonly value: T
}

const Type = {
  Some: Symbol('Some'),
  None: Symbol('None')
}

export type Option<T> = None | Some<T>

export function Some<T>(value: T): Some<T> {
  return {
    type: Type.Some,
    value
  }
}

export const None: None = { type: Type.None }

export function ofNullable<T>(value?: T | null): Option<T> {
  return value == null ? None : Some(value)
}

export function isSome<T>(option: Option<T>): option is Some<T> {
  return option.type === Type.Some
}

export function isNone<T>(option: Option<T>): option is None {
  return option.type === Type.None
}

export function contains<T>(match: T, option: Option<T>): boolean {
  return isSome(option) && option.value === match
}

export function flatten<T>(option: Option<Option<T>>): Option<T> {
  return isSome(option) ? option.value : None
}

export function getOrElse<T, U>(fn: () => U, option: Option<T>): T | U {
  return isSome(option) ? option.value : fn()
}

export function map<T, U>(fn: (value: T) => U, option: Option<T>): Option<U> {
  return isSome(option) ? Some(fn(option.value)) : None
}

export function flatMap<T, U>(
  fn: (value: T) => Option<U>,
  option: Option<T>
): Option<U> {
  return isSome(option) ? fn(option.value) : None
}

export function filter<T>(
  fn: (value: T) => boolean,
  option: Option<T>
): Option<T> {
  return isSome(option) && fn(option.value) ? option : None
}

export function or<T>(alternative: Option<T>, option: Option<T>): Option<T> {
  return isSome(option) ? option : alternative
}

export function and<T>(alternative: Option<T>, option: Option<T>): Option<T> {
  return isSome(option) ? alternative : None
}

export function fold<T, U>(
  onSome: (value: T) => U,
  onNone: () => U,
  option: Option<T>
): U {
  return isSome(option) ? onSome(option.value) : onNone()
}
