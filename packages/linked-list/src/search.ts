import { None, Option, Some, map } from '@pacote/option'
import {
  car,
  cdr,
  isEmpty,
  length,
  LinkedList,
  PredicateFunction,
  reverse,
} from './core'

const fnFalse = () => false
const fnTrue = () => true
const fnNone = () => None

function recursiveFind<T, R>(
  predicate: (value: T, index: number) => boolean,
  onFound: (current: T, index: number) => R,
  onFinished: () => R,
  current: LinkedList<T>,
  index: number,
): R {
  return isEmpty(current)
    ? onFinished()
    : predicate(car(current), index)
    ? onFound(car(current), index)
    : recursiveFind(predicate, onFound, onFinished, cdr(current), index + 1)
}

/**
 * Return an `Option` with the first element in the list that satisfies the
 * provided `predicate` function. If the element cannot be found, it returns
 * `None`.
 *
 * @param predicate Predicate function.
 * @param list      Linked list.
 *
 * @returns `Option` with the first element in the list that satisfies the
 *          predicate function or `None`.
 *
 * @category Searching
 */
export function find<T>(
  predicate: PredicateFunction<T>,
  list: LinkedList<T>,
): Option<T> {
  return recursiveFind<T, Option<T>>(
    (current, index) => predicate(current, index, list),
    Some,
    fnNone,
    list,
    0,
  )
}

/**
 * Return an `Option` with the element at the provided index, or `None`
 * if the index is out of bounds.
 *
 * @param index Element index.
 * @param list  Linked list.
 *
 * @returns `Option` with the element at the provided index or `None`.
 *
 * @category Searching
 */
export function get<T>(index: number, list: LinkedList<T>): Option<T> {
  const intIndex = Math.trunc(index)
  return find((_, idx) => idx === intIndex, list)
}

/**
 * Behaves like `get()`, except when a negative index is provided, in
 * which case it returns an `Option` with the element at the provided index
 * starting from the end of the list.
 *
 * @param index Element index.
 * @param list  Linked list.
 *
 * @returns `Option` with the element at the provided index or `None`.
 *
 * @category Searching
 */
export function at<T>(index: number, list: LinkedList<T>): Option<T> {
  const intIndex = Math.trunc(index)
  return get(intIndex >= 0 ? intIndex : length(list) + intIndex, list)
}

/**
 * @deprecated Use `at()`.
 */
export function item<T>(index: number, list: LinkedList<T>): Option<T> {
  return at(index, list)
}

/**
 * Returns `true` if all the elements in the list satisfy the provided
 * predicate function, otherwise it returns `false`.
 *
 * @param predicate Predicate function.
 * @param list      Linked list.
 *
 * @returns Whether all the elements satisfy the predicate function.
 *
 * @category Searching
 */
export function every<T>(
  predicate: PredicateFunction<T>,
  list: LinkedList<T>,
): boolean {
  return recursiveFind(
    (current, index) => !predicate(current, index, list),
    fnFalse,
    fnTrue,
    list,
    0,
  )
}

/**
 * Returns `true` if at least one element in the list satisfies the provided
 * predicate function, otherwise it returns `false`.
 *
 * @param predicate Predicate function.
 * @param list      Linked list.
 *
 * @returns Whether some of the elements satisfy the predicate function.
 *
 * @category Searching
 */
export function some<T>(
  predicate: PredicateFunction<T>,
  list: LinkedList<T>,
): boolean {
  return recursiveFind(
    (current, index) => predicate(current, index, list),
    fnTrue,
    fnFalse,
    list,
    0,
  )
}

/**
 * Returns `true` is the provided element exists in the list, otherwise it
 * returns `false`.
 *
 * @param value Value to search.
 * @param list  Linked list.
 *
 * @returns Whether the element exists in the list.
 *
 * @category Searching
 */
export function includes<T>(value: T, list: LinkedList<T>): boolean {
  return some((v) => v === value, list)
}

/**
 * Returns an `Option` with the first index at which a given element can be
 * found in the list, or `None` if it is not present.
 *
 * @param value Element to search.
 * @param list  Linked list.
 *
 * @returns First index of the list element matching the provided value.
 *
 * @category Searching
 */
export function indexOf<T>(value: T, list: LinkedList<T>): Option<number> {
  return recursiveFind<T, Option<number>>(
    (current) => current === value,
    (_, index) => Some(index),
    fnNone,
    list,
    0,
  )
}

/**
 * Returns an `Option` with the last index at which a given element can be
 * found in the list, or `None` if it is not present. The list is
 * searched backwards.
 *
 * @param value Element to search.
 * @param list  Linked list.
 *
 * @returns Last index of the list element matching the provided value.
 *
 * @category Searching
 */
export function lastIndexOf<T>(value: T, list: LinkedList<T>): Option<number> {
  return map(
    (lastIndex: number) => length(list) - lastIndex - 1,
    recursiveFind<T, Option<number>>(
      (current) => current === value,
      (_, index) => Some(index),
      fnNone,
      reverse(list),
      0,
    ),
  )
}

/**
 * Returns an `Option` with index of first element in the list that satisfies
 * the provided predicate function. If the element cannot be found, it
 * returns `None`.
 *
 * @param predicate Predicate function.
 * @param list      Linked list.
 *
 * @returns First index of the list element satisfied by the predicate.
 *
 * @category Searching
 */
export function findIndex<T>(
  predicate: PredicateFunction<T>,
  list: LinkedList<T>,
): Option<number> {
  return recursiveFind<T, Option<number>>(
    (current, index) => predicate(current, index, list),
    (_, index) => Some(index),
    fnNone,
    list,
    0,
  )
}
