import { None, type Option, Some } from '@pacote/option'

type Empty = undefined
type Cons<T> = readonly [value: T, next: Cons<T> | Empty]
export type LinkedList<T> = Cons<T> | Empty

type CallbackArgs<T> = [value: T, index: number, collection: LinkedList<T>]
type MapCallback<T, R> = (...args: CallbackArgs<T>) => R
type ReduceCallback<T, R> = (acc: R, ...args: CallbackArgs<T>) => R
export type PredicateFunction<T> = MapCallback<T, boolean>

export function car<T>(cons: Cons<T>): T {
  return cons[0]
}

/**
 * Return all the elements of the linked list beyond the head element.
 * If the linked list is empty or has a single element, it returns an empty
 * list.
 *
 * @param list Linked list.
 *
 * @returns The rest of the list.
 */
export function cdr<T>(cons: LinkedList<T>): LinkedList<T> {
  return cons?.[1]
}

export function emptyList<T>(): LinkedList<T> {
  return undefined
}

/**
 * Check whether a list is empty.
 *
 * @param list Linked list.
 *
 * @returns `true` if the provided linked list is empty, `false` otherwise.
 */
export function isEmpty(list: any): list is Empty {
  return list === undefined
}

/**
 * Add a new element at the head of the linked list.
 *
 * @param value Element to add.
 * @param list  Linked list.
 *
 * @returns A new list with the element added at the head.
 */
export function prepend<T>(value: T, list: LinkedList<T>): LinkedList<T> {
  return [value, list]
}

function recursiveReduce<T, R>(
  acc: R,
  callback: ReduceCallback<T, R>,
  current: LinkedList<T>,
  step: -1 | 1,
  index: number,
  collection: LinkedList<T>,
): R {
  return isEmpty(current)
    ? acc
    : recursiveReduce(
        callback(acc, car(current), index, collection),
        callback,
        cdr(current),
        step,
        index + step,
        collection,
      )
}

/**
 * Executes the provided callback function on each element of
 * the list, resulting in a single output value, which gets successively
 * passed to the callback function in the next execution.
 *
 * The first time the callback function is executed, it receives the
 * `initial` value.
 *
 * The result of the last execution of the callback function is returned.
 *
 * @param callback Callback function.
 * @param initial  Initial value.
 * @param list     Linked list.
 *
 * @returns Result of the last execution of the callback.
 *
 * @category Folding
 */
export function reduce<T, R>(
  callback: ReduceCallback<T, R>,
  initial: R,
  list: LinkedList<T>,
): R {
  return recursiveReduce(initial, callback, list, 1, 0, list)
}

/**
 * Invert the order of the elements in the provided linked list.
 *
 * @param list Linked list.
 *
 * @returns A new reversed list.
 *
 * @category Transformation
 */
export function reverse<T>(list: LinkedList<T>): LinkedList<T> {
  return reduce((acc, value) => prepend(value, acc), emptyList(), list)
}

/**
 * Combine two linked lists.
 *
 * @param front Linked list at the front.
 * @param back  Linked list at the back.
 *
 * @returns A new linked list with the two provided lists concatenated.
 */
export function concat<T>(
  front: LinkedList<T>,
  back: LinkedList<T>,
): LinkedList<T> {
  return reduce((acc, value) => prepend(value, acc), back, reverse(front))
}

/**
 * Add an element to the tail of the provided list.
 *
 * @param value Value to append.
 * @param list  Linked list.
 *
 * @returns New linked list with the element appended to the end.
 */
export function append<T>(value: T, list: LinkedList<T>): LinkedList<T> {
  return reverse(prepend(value, reverse(list)))
}

/**
 * Count the number of elements in a list.
 *
 * @param list Linked list.
 *
 * @returns Number of list elements.
 */
export function length<T>(list: LinkedList<T>): number {
  return reduce((count) => count + 1, 0, list)
}

/**
 * Works like `reduce()`, but the list is iterated starting at the tail.
 *
 * @param callback Callback function.
 * @param initial  Initial value.
 * @param list     Linked list.
 *
 * @returns Result of the last execution of the callback.
 *
 * @category Folding
 */
export function reduceRight<T, R>(
  callback: ReduceCallback<T, R>,
  initial: R,
  list: LinkedList<T>,
): R {
  const lastIndex = length(list) - 1
  return recursiveReduce(initial, callback, reverse(list), -1, lastIndex, list)
}

/**
 * Iterate over all items in the provided list and evaluates each element
 * through a callback function, returning a new list containing the resulting
 * values.
 *
 * @param callback Function that receives and transforms each item.
 * @param list     Linked list.
 *
 * @returns A new list containing the mapped items.
 *
 * @category Transformation
 */
export function map<T, R>(
  callback: MapCallback<T, R>,
  list: LinkedList<T>,
): LinkedList<R> {
  return reverse(
    reduce(
      (acc, value, index, collection) =>
        prepend(callback(value, index, collection), acc),
      emptyList(),
      list,
    ),
  )
}

/**
 * Iterate over all items in the provided list and evaluates each
 * element through a callback function and flattening the result by one
 * level.
 *
 * @param callback Function that receives and transforms each item.
 * @param list     Linked list.
 *
 * @returns A new list containing the flatmapped items.
 *
 * @category Transformation
 */
export function flatMap<T, R>(
  callback: MapCallback<T, LinkedList<R>>,
  list: LinkedList<T>,
): LinkedList<R> {
  return reverse(
    reduce(
      (acc, value, index, collection) =>
        concat(reverse(callback(value, index, collection)), acc),
      emptyList(),
      list,
    ),
  )
}

/**
 * Iterate over all items in the provided list and evaluates a predicate
 * function for each one, returning a new list containing only filtered
 * items.
 *
 * @param predicate Predicate function that receives each item. If the function
 *                  returns `true`, the item is included in the filtered list.
 * @param list      Linked list.
 *
 * @returns A new list containing only the filtered items.
 *
 * @category Sublist
 */
export function filter<T>(
  predicate: PredicateFunction<T>,
  list: LinkedList<T>,
): LinkedList<T> {
  return reverse(
    reduce(
      (acc, value, index, collection) =>
        predicate(value, index, collection) ? prepend(value, acc) : acc,
      emptyList(),
      list,
    ),
  )
}

/**
 * Get the first element of the provided list.
 *
 * @param list Linked list.
 *
 * @returns `Option` with the first element of the linked list, or
 *          `None` if the linked list is empty.
 */
export function head<T>(list: LinkedList<T>): Option<T> {
  return isEmpty(list) ? None : Some(car(list))
}

/**
 * Get the last element of the provided list.
 *
 * @param list Linked list.
 *
 * @returns `Option` with the final element in the linked list. If the
 *          linked list is empty, it returns `None`.
 */
export function tail<T>(list: LinkedList<T>): Option<T> {
  return reduce<T, Option<T>>((_, value) => Some(value), None, list)
}
