import { None, Option, Some } from '@pacote/option'

type Empty = undefined
type Cons<T> = readonly [value: T, next: Cons<T> | Empty]
export type LinkedList<T> = Cons<T> | Empty

type CallbackArgs<T> = [value: T, index: number, collection: LinkedList<T>]
type MapCallback<T, R> = (...args: CallbackArgs<T>) => R
type ReduceCallback<T, R> = (acc: R, ...args: CallbackArgs<T>) => R
export type PredicateFunction<T> = MapCallback<T, boolean>

enum Step {
  Increment = 1,
  Decrement = -1,
}

export function car<T>(cons: Cons<T>): T {
  return cons[0]
}

export function cdr<T>(cons: Cons<T> | Empty): Cons<T> | Empty {
  return cons?.[1]
}

export function emptyList<T>(): LinkedList<T> {
  return undefined
}

export function isEmpty(list: any): list is Empty {
  return list === undefined
}

export function prepend<T>(value: T, list: LinkedList<T>): LinkedList<T> {
  return [value, list]
}

function recursiveReduce<T, R>(
  acc: R,
  callback: ReduceCallback<T, R>,
  current: LinkedList<T>,
  step: Step,
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
  return recursiveReduce(initial, callback, list, Step.Increment, 0, list)
}

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
  return recursiveReduce(
    initial,
    callback,
    reverse(list),
    Step.Decrement,
    lastIndex,
    list
  )
}

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
