import { None, Option, Some } from '@pacote/option'

type Empty = undefined
type Cons<T> = readonly [value: T, next: Cons<T> | Empty]
export type LinkedList<T> = Cons<T> | Empty

type FunctionArgs<T> = [value: T, index: number, collection: LinkedList<T>]
type MapFunction<T, R> = (...args: FunctionArgs<T>) => R
export type PredicateFunction<T> = MapFunction<T, boolean>
type ReduceFn<T, R> = (acc: R, ...args: FunctionArgs<T>) => R

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

export function append<T>(value: T, list: LinkedList<T>): LinkedList<T> {
  return reverse(prepend(value, reverse(list)))
}

function recursiveReduce<T, R>(
  acc: R,
  reducer: ReduceFn<T, R>,
  current: LinkedList<T>,
  step: number,
  index: number,
  collection: LinkedList<T>
): R {
  return isEmpty(current)
    ? acc
    : recursiveReduce(
        reducer(acc, car(current), index, collection),
        reducer,
        cdr(current),
        step,
        index + step,
        collection
      )
}

export function reduce<T, R>(
  reducer: ReduceFn<T, R>,
  initial: R,
  list: LinkedList<T>
): R {
  return recursiveReduce(initial, reducer, list, 1, 0, list)
}

export function reduceRight<T, R>(
  reducer: ReduceFn<T, R>,
  initial: R,
  list: LinkedList<T>
): R {
  const lastIndex = length(list) - 1
  return recursiveReduce(initial, reducer, reverse(list), -1, lastIndex, list)
}

export function map<T, R>(
  mapper: MapFunction<T, R>,
  list: LinkedList<T>
): LinkedList<R> {
  return reverse(
    reduce(
      (acc, value, index, collection) =>
        prepend(mapper(value, index, collection), acc),
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

export function reverse<T>(list: LinkedList<T>): LinkedList<T> {
  return reduce((acc, value) => prepend(value, acc), emptyList(), list)
}

export function length<T>(list: LinkedList<T>): number {
  return reduce((count) => count + 1, 0, list)
}

export function concat<T>(
  front: LinkedList<T>,
  back: LinkedList<T>
): LinkedList<T> {
  return reduce((acc, value) => prepend(value, acc), back, reverse(front))
}

export function head<T>(list: LinkedList<T>): Option<T> {
  return isEmpty(list) ? None : Some(car(list))
}

export function tail<T>(list: LinkedList<T>): Option<T> {
  return reduce<T, Option<T>>((_, value) => Some(value), None, list)
}
