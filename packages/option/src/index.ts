const T_NONE = Symbol('None')
const T_SOME = Symbol('Some')

interface None {
  readonly type: typeof T_NONE
}

interface Some<T> {
  readonly type: typeof T_SOME
  readonly value: T
}

export type Option<T> = None | Some<T>

export function Some<T>(value: T): Some<T> {
  return {
    type: T_SOME,
    value,
  }
}

export const None: None = { type: T_NONE }

export function ofNullable<T>(value?: T | null): Option<T> {
  return value == null ? None : Some(value)
}

export function isSome<T>(option: Option<T>): option is Some<T> {
  return option.type === T_SOME
}

export function isNone<T>(option: Option<T>): option is None {
  return option.type === T_NONE
}

export function contains<T>(match: T, option: Option<T>): boolean {
  return isSome(option) && option.value === match
}

export function flatten<T>(option: Option<Option<T>>): Option<T> {
  return isSome(option) ? option.value : None
}

export function getOrElse<T>(fn: () => T, option: Option<T>): T {
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
