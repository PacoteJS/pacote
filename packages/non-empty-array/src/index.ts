import { Option, Some, None } from '@pacote/option'

export interface NonEmptyArray<T> extends ReadonlyArray<T> {
  0: T
}

function isNotEmpty<T>(value: readonly T[]): value is NonEmptyArray<T> {
  return value.length > 0
}

export function isNonEmptyArray<T>(value: any): value is NonEmptyArray<T> {
  return Array.isArray(value) && isNotEmpty(value)
}

export function fromArray<T>(array: readonly T[]): Option<NonEmptyArray<T>> {
  return isNotEmpty(array) ? Some(array) : None
}

export function fromElements<T>(
  first: T,
  ...rest: readonly T[]
): NonEmptyArray<T> {
  return [first, ...rest]
}

export function concat<T>(
  before: readonly T[],
  after: NonEmptyArray<T>
): NonEmptyArray<T>
export function concat<T>(
  before: NonEmptyArray<T>,
  after: readonly T[]
): NonEmptyArray<T>
export function concat<T>(
  before: readonly T[],
  after: readonly T[]
): readonly T[] {
  return before.concat(after)
}
