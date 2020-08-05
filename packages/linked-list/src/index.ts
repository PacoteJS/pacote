type Empty = undefined
type Cons<T> = readonly [T, Cons<T> | Empty]
type LinkedList<T> = Cons<T> | Empty

type MapFn<T, R> = (value: T, index: number, collection: LinkedList<T>) => R
type PredicateFn<T> = MapFn<T, boolean>
type ReduceFn<T, R> = (
  acc: R,
  value: T,
  index: number,
  collection: LinkedList<T>
) => R

function car<T>(cons: Cons<T>): T {
  return cons[0]
}

function cdr<T>(cons: Cons<T>): Cons<T> | Empty {
  return cons[1]
}

function empty<T>(): LinkedList<T> {
  return undefined
}

export function isEmpty(list: any): list is Empty {
  return list === undefined
}

function _reduce<T, R>(
  acc: R,
  reducer: ReduceFn<T, R>,
  current: LinkedList<T>,
  step: number,
  index: number,
  collection: LinkedList<T>
): R {
  return isEmpty(current)
    ? acc
    : _reduce(
        reducer(acc, car(current), index, collection),
        reducer,
        cdr(current),
        step,
        index + step,
        collection
      )
}

export function listOf<T>(...items: T[]): LinkedList<T> {
  return items
    .reverse()
    .reduce((list, value) => prepend(value, list), empty<T>())
}

export function length<T>(list: LinkedList<T>): number {
  return reduce((count) => count + 1, 0, list)
}

export function head<T>(list: LinkedList<T>): T | undefined {
  return isEmpty(list) ? undefined : car(list)
}

export function reverse<T>(list: LinkedList<T>): LinkedList<T> {
  return reduce((acc, value) => prepend(value, acc), empty(), list)
}

export function tail<T>(list: LinkedList<T>): T | undefined {
  return reduce<T, T | undefined>((_, value) => value, undefined, list)
}

export function prepend<T>(value: T, list: LinkedList<T>): Cons<T> {
  return [value, list]
}

export function append<T>(value: T, list: LinkedList<T>): LinkedList<T> {
  return reverse(prepend(value, reverse(list)))
}

export function rest<T>(list: LinkedList<T>): LinkedList<T> {
  return isEmpty(list) ? list : cdr(list)
}

export function concat<T>(
  front: LinkedList<T>,
  back: LinkedList<T>
): LinkedList<T> {
  return reduce((acc, value) => prepend(value, acc), back, reverse(front))
}

export function toArray<T>(list: LinkedList<T>): T[] {
  return reduce<T, T[]>(
    (acc, value) => {
      acc.push(value)
      return acc
    },
    [],
    list
  )
}

export function reduce<T, R>(
  reducer: ReduceFn<T, R>,
  initial: R,
  list: LinkedList<T>
): R {
  return _reduce(initial, reducer, list, 1, 0, list)
}

export function reduceRight<T, R>(
  reducer: ReduceFn<T, R>,
  initial: R,
  list: LinkedList<T>
): R {
  const lastIndex = length(list) - 1
  return _reduce(initial, reducer, reverse(list), -1, lastIndex, list)
}

export function map<T, R>(
  mapper: MapFn<T, R>,
  list: LinkedList<T>
): LinkedList<R> {
  return reverse(
    reduce(
      (acc, value, index, collection) =>
        prepend(mapper(value, index, collection), acc),
      empty<R>(),
      list
    )
  )
}

export function filter<T>(
  predicate: PredicateFn<T>,
  list: LinkedList<T>
): LinkedList<T> {
  return reverse(
    reduce(
      (acc, value, index, collection) =>
        predicate(value, index, collection) ? prepend(value, acc) : acc,
      empty<T>(),
      list
    )
  )
}

function _find<T>(
  predicate: PredicateFn<T>,
  current: LinkedList<T>,
  index: number,
  collection: LinkedList<T>
): T | undefined {
  return isEmpty(current) || predicate(car(current), index, collection)
    ? head(current)
    : _find(predicate, rest(current), index + 1, collection)
}

export function find<T>(
  predicate: PredicateFn<T>,
  list: LinkedList<T>
): T | undefined {
  return _find(predicate, list, 0, list)
}

function _iterator<T, R>(
  list: LinkedList<T>,
  result: (key: number, value: T) => R
): IterableIterator<R> {
  let key = 0
  let current = list

  return {
    [Symbol.iterator]: function () {
      return this
    },
    next: function () {
      if (isEmpty(current)) {
        return { done: true, value: undefined }
      } else {
        const value = result(key++, car(current))
        current = rest(current)
        return { done: false, value }
      }
    },
  }
}

export function entries<T>(list: LinkedList<T>): IterableIterator<[number, T]> {
  return _iterator(list, (key, value) => [key, value])
}

export function keys<T>(list: LinkedList<T>): IterableIterator<number> {
  return _iterator(list, (key) => key)
}

export function values<T>(list: LinkedList<T>): IterableIterator<T> {
  return _iterator(list, (_, value) => value)
}
