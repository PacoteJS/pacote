import { Option, Some, None } from '@pacote/option'

export type NonEmptyArray<T> = [T, ...T[]]

function isNotEmpty<T>(value: readonly T[]): value is NonEmptyArray<T> {
  return value.length > 0
}

/**
 * Checks if the provided value is a non-empty array.
 *
 * @param value Value to evaluate.
 *
 * @returns Whether the value is a non-empty array.
 */
export function isNonEmptyArray<T>(value: any): value is NonEmptyArray<T> {
  return Array.isArray(value) && isNotEmpty(value)
}

/**
 * Creates a new `NonEmptyArray` from an arbitrary array in a typesafe manner,
 * returning `Some(array)` if it is not empty. If it's empty, it returns `None`.
 *
 * @example
 * ```typescript
 * import { fromArray } from '@pacote/non-empty-array'
 *
 * fromArray([1, 2, 3]) // => Some([1, 2, 3])
 * fromArray([]) // => None
 * ```
 *
 * @param array Array to create.
 *
 * @returns A `Some` containing the non-empty array, or `None` if empty.
 */
export function fromArray<T>(array: readonly T[]): Option<NonEmptyArray<T>> {
  return isNotEmpty(array) ? Some(array) : None
}

/**
 * Creates a new non-empty array from a list of argument elements.
 *
 * @example
 * ```typescript
 * import { fromElements } from '@pacote/non-empty-array'
 *
 * fromElements(1, 2, 3) // => [1, 2, 3]
 * fromElements() // => TypeScript compilation error
 * ```
 *
 * @param first Required first element of the non-empty array.
 * @param rest  Remaining elements of the non-empty array.
 *
 * @returns Non-empty array with the provided arguments in order.
 */
export function fromElements<T>(
  first: T,
  ...rest: readonly T[]
): NonEmptyArray<T> {
  return [first, ...rest]
}

/**
 * Joins two `Array`s or `NonEmptyArray`s in order, returning a new
 * `NonEmptyArray`. At least one of the provided arrays must be non-empty.
 *
 * @example
 * ```typescript
 * import { concat } from '@pacote/non-empty-array'
 *
 * concat([1, 2], [3, 4]) // => [1, 2, 3, 4]
 * concat([1], []) // => [1]
 * concat([], []) // => TypeScript compilation error
 * ```
 *
 * @param before First array to concatenate.
 * @param after  Second array to concatenate.
 *
 * @returns Combined non-empty array.
 */
export function concat<T>(
  before: readonly T[],
  after: NonEmptyArray<T>,
): NonEmptyArray<T>
export function concat<T>(
  before: NonEmptyArray<T>,
  after: readonly T[],
): NonEmptyArray<T>
export function concat<T>(
  before: readonly T[],
  after: readonly T[],
): readonly T[] {
  return before.concat(after)
}
