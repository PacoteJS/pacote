const T_NONE = Symbol('None')
const T_SOME = Symbol('Some')

export interface None {
  readonly type: typeof T_NONE
}

export interface Some<T> {
  readonly type: typeof T_SOME
  readonly value: T
}

export type Option<T> = None | Some<T>

/**
 * Represents a value of type `T`.
 *
 * @param value Value to contain.
 *
 * @returns An instance of `Some<T>`
 *
 * @category Constructors
 */
export function Some<T>(value: T): Some<T> {
  return {
    type: T_SOME,
    value,
  }
}

/**
 * Represents no value.
 *
 * @category Constructors
 */
export const None: None = { type: T_NONE }

/**
 * Creates a new instance of `Option` based on the value passed.
 *
 * @param value Value to put in an `Option`.
 *
 * @returns     If the value is `null` or `undefined`, it returns `None`.
 *              Otherwise, it returns `Some(value)`.
 *
 * @category Constructors
 */
export function ofNullable<T>(value?: T | null): Option<T> {
  return value == null ? None : Some(value)
}

/**
 * Creates a new instance of `Option` based on a function call.
 *
 * @param fn  Function to evaluate.
 *
 * @returns   If the function throws an error, it returns `None`. Otherwise,
 *            it returns the result value in a `Some`.
 *
 * @category Constructors
 */
export function tryCatch<T>(fn: () => T): Option<T> {
  try {
    return Some(fn())
  } catch {
    return None
  }
}

/**
 * Checks whether an `Option` has some value.
 *
 * @param option  Value to evaluate.
 *
 * @returns       Returns `true` if the passed option is a `Some`. Otherwise,
 *                it returns `false`.
 */
export function isSome<T>(option: Option<T>): option is Some<T> {
  return option.type === T_SOME
}

/**
 * Checks whether an `Option` has no value.
 *
 * @param option  Value to evaluate.
 *
 * @returns       Returns `true` if the passed option is a `None`. Otherwise,
 *                it returns `false`.
 */
export function isNone<T>(option: Option<T>): option is None {
  return option.type === T_NONE
}

/**
 * Checks whether the `Option` value exactly matches a value.
 * 
 * @param match   Value to match.
 * @param option  Value to evaluate.
 * 
 * @returns       Returns `true` if the `Some` value is the same as `match`.
 *                Otherwise, it returns
`false`.
 */
export function contains<T>(match: T, option: Option<T>): boolean {
  return isSome(option) && option.value === match
}

/**
 * Converts `Option<Option<T>>` to `Option<T>`.
 *
 * @param option Nested `Option` value.
 *
 * @returns Flattened result.
 */
export function flatten<T>(option: Option<Option<T>>): Option<T> {
  return isSome(option) ? option.value : None
}

/**
 * Returns the value contained in the `Option`. If the option is `None`, it
 * evaluates the provided function for an alternative.
 *
 * @param fn     Function to evaluate in case the option is `None`.
 * @param option `Option` possibly containing the value to get.
 *
 * @returns
 */
export function getOrElse<T>(fn: () => T, option: Option<T>): T {
  return isSome(option) ? option.value : fn()
}

/**
 * Maps an `Option<T>` to `Option<U>` by applying a function to a contained
 * value.
 *
 * @param fn      Mapping function.
 * @param option  `Option` to map.
 *
 * @returns       Mapped `Option`.
 */
export function map<T, U>(fn: (value: T) => U, option: Option<T>): Option<U> {
  return isSome(option) ? Some(fn(option.value)) : None
}

/**
 * Returns `None` if the option is `None`, otherwise calls the function with
 * the wrapped value and returns the result.
 *
 * @param fn      Flat map function.
 * @param option  `Option` to flat map.
 *
 * @returns       Flat mapped `Option`.
 */
export function flatMap<T, U>(
  fn: (value: T) => Option<U>,
  option: Option<T>
): Option<U> {
  return isSome(option) ? fn(option.value) : None
}

/**
 * Returns `None` if the option is `None`, otherwise calls `predicate` with
 * the wrapped value and conditionally returns the option or `None`.
 *
 * @param fn      Predicate.
 * @param option  Option to evaluate.
 *
 * @returns       `Some<T>` if the predicate returns `true`, or `None` if the
 *                predicate returns `false`.
 */
export function filter<T>(
  fn: (value: T) => boolean,
  option: Option<T>
): Option<T> {
  return isSome(option) && fn(option.value) ? option : None
}

/**
 * Returns the option if it contains a value, otherwise returns the
 * alternative.
 *
 * @param alternative Alternative to return.
 * @param option      Option to evaluate.
 *
 * @returns           The provided option if it is `Some`, otherwise the
 *                    alternative is returned.
 */
export function or<T>(alternative: Option<T>, option: Option<T>): Option<T> {
  return isSome(option) ? option : alternative
}

/**
 * Returns `None` if the option is `None`, otherwise returns the alternative.
 *
 * @param alternative Alternative to return.
 * @param option      Option to evaluate.
 *
 * @returns           `None` if the provided alternative is `None`, otherwise
 *                    the alternative is returned.
 */
export function and<T>(alternative: Option<T>, option: Option<T>): Option<T> {
  return isSome(option) ? alternative : None
}

/**
 * Applies the `onSome` function to the contained value, otherwise it
 * computes a default using `onNone`.
 *
 * @param onSome Function to evaluate if the option is `Some`.
 * @param onNone Function to evaluate if the option is `None`.
 * @param option `Option` containing the value to fold,
 *
 * @returns Folded option value.
 */
export function fold<T, U>(
  onSome: (value: T) => U,
  onNone: () => U,
  option: Option<T>
): U {
  return isSome(option) ? onSome(option.value) : onNone()
}
