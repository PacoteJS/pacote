const T_NOTHING = Symbol('Nothing')

type Cons<T> = readonly [T, Cons<T> | undefined]
type EmptyCons = readonly [typeof T_NOTHING, undefined]
type LinkedList<T> = Cons<T> | EmptyCons

type Map<T, R> = (value: T, index: number, collection: LinkedList<T>) => R
type Predicate<T> = Map<T, boolean>
type Reduce<T, R> = (
  acc: R,
  value: T,
  index: number,
  collection: LinkedList<T>
) => R

function car<T>(cons: Cons<T>): T {
  return cons[0]
}

function cdr<T>(cons: Cons<T> | EmptyCons): Cons<T> | undefined {
  return cons[1]
}

function empty<T>(): LinkedList<T> {
  return [T_NOTHING, undefined]
}

function isEmpty(list: any): list is EmptyCons {
  return car(list) === T_NOTHING
}

function _reduce<T, R>(
  accumulator: R,
  reducer: Reduce<T, R>,
  current: LinkedList<T>,
  index: number,
  collection: LinkedList<T>
): R {
  return isEmpty(current)
    ? accumulator
    : _reduce(
        reducer(accumulator, car(current), index, collection),
        reducer,
        cdr(current) ?? empty(),
        index + 1,
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

export function tail<T>(list: LinkedList<T>): T | undefined {
  return reduce<T, T | undefined>((_, value) => value, undefined, list)
}

export function prepend<T>(value: T, list: LinkedList<T>): Cons<T> {
  return [value, isEmpty(list) ? undefined : list]
}

export function reverse<T>(list: LinkedList<T>): LinkedList<T> {
  return reduce((acc, value) => prepend(value, acc), empty(), list)
}

export function append<T>(value: T, list: LinkedList<T>): LinkedList<T> {
  return isEmpty(list)
    ? prepend(value, list)
    : reverse(prepend(value, reverse(list)))
}

export function rest<T>(list: LinkedList<T>): LinkedList<T> {
  return cdr(list) ?? empty()
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
  reducer: Reduce<T, R>,
  initial: R,
  list: LinkedList<T>
): R {
  return _reduce(initial, reducer, list, 0, list)
}

export function map<T, R>(map: Map<T, R>, list: LinkedList<T>): LinkedList<R> {
  return reverse(
    reduce(
      (acc, value, index, collection) =>
        prepend(map(value, index, collection), acc),
      empty<R>(),
      list
    )
  )
}

export function filter<T>(
  predicate: Predicate<T>,
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
  predicate: Predicate<T>,
  current: LinkedList<T>,
  index: number,
  collection: LinkedList<T>
): T | undefined {
  return isEmpty(current)
    ? undefined
    : predicate(car(current), index, collection)
    ? car(current)
    : _find(predicate, rest(current), index + 1, collection)
}

export function find<T>(
  predicate: Predicate<T>,
  list: LinkedList<T>
): T | undefined {
  return _find(predicate, list, 0, list)
}
