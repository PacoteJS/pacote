import { None, Option, Some } from '@pacote/option'

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
  collection: LinkedList<T>
): R {
  return isEmpty(current)
    ? acc
    : recursiveReduce(
        callback(acc, car(current), index, collection),
        callback,
        cdr(current),
        step,
        index + step,
        collection
      )
}

export function reduce<T, R>(
  callback: ReduceCallback<T, R>,
  initial: R,
  list: LinkedList<T>
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

export function concat<T>(
  front: LinkedList<T>,
  back: LinkedList<T>
): LinkedList<T> {
  return reduce((acc, value) => prepend(value, acc), back, reverse(front))
}

export function append<T>(value: T, list: LinkedList<T>): LinkedList<T> {
  return reverse(prepend(value, reverse(list)))
}

export function length<T>(list: LinkedList<T>): number {
  return reduce((count) => count + 1, 0, list)
}

export function reduceRight<T, R>(
  callback: ReduceCallback<T, R>,
  initial: R,
  list: LinkedList<T>
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
  list: LinkedList<T>
): LinkedList<R> {
  return reverse(
    reduce(
      (acc, value, index, collection) =>
        prepend(callback(value, index, collection), acc),
      emptyList(),
      list
    )
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
  list: LinkedList<T>
): LinkedList<R> {
  return reverse(
    reduce(
      (acc, value, index, collection) =>
        concat(reverse(callback(value, index, collection)), acc),
      emptyList(),
      list
    )
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
  list: LinkedList<T>
): LinkedList<T> {
  return reverse(
    reduce(
      (acc, value, index, collection) =>
        predicate(value, index, collection) ? prepend(value, acc) : acc,
      emptyList(),
      list
    )
  )
}

export function head<T>(list: LinkedList<T>): Option<T> {
  return isEmpty(list) ? None : Some(car(list))
}

export function tail<T>(list: LinkedList<T>): Option<T> {
  return reduce<T, Option<T>>((_, value) => Some(value), None, list)
}
