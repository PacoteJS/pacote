import {
  car,
  cdr,
  Cons,
  emptyList,
  isEmpty,
  iterator,
  LinkedList,
  MapFn,
  PredicateFn,
  recursiveFind,
  recursiveReduce,
  ReduceFn,
  CompareFn,
} from './internal'

export { isEmpty } from './internal'

export function listOf<T>(...items: T[]): LinkedList<T> {
  return items
    .reverse()
    .reduce((list, value) => prepend(value, list), emptyList<T>())
}

export function length<T>(list: LinkedList<T>): number {
  return reduce((count) => count + 1, 0, list)
}

export function head<T>(list: LinkedList<T>): T | undefined {
  return isEmpty(list) ? undefined : car(list)
}

export function rest<T>(list: LinkedList<T>): LinkedList<T> {
  return isEmpty(list) ? list : cdr(list)
}

export function reverse<T>(list: LinkedList<T>): LinkedList<T> {
  return reduce((acc, value) => prepend(value, acc), emptyList(), list)
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
  mapper: MapFn<T, R>,
  list: LinkedList<T>
): LinkedList<R> {
  return reverse(
    reduce(
      (acc, value, index, collection) =>
        prepend(mapper(value, index, collection), acc),
      emptyList<R>(),
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
      emptyList<T>(),
      list
    )
  )
}

export function indexOf<T>(value: T, list: LinkedList<T>): number {
  return recursiveFind(
    (current) => current === value,
    (_, index) => index,
    () => -1,
    list,
    0
  )
}

export function lastIndexOf<T>(value: T, list: LinkedList<T>): number {
  const lastIndex = recursiveFind(
    (current) => current === value,
    (_, index) => index,
    () => -1,
    reverse(list),
    0
  )
  return lastIndex === -1 ? lastIndex : length(list) - lastIndex - 1
}

export function find<T>(
  predicate: PredicateFn<T>,
  list: LinkedList<T>
): T | undefined {
  return recursiveFind(
    (current, index) => predicate(current, index, list),
    (value) => value,
    () => undefined,
    list,
    0
  )
}

export function every<T>(
  predicate: PredicateFn<T>,
  list: LinkedList<T>
): boolean {
  return recursiveFind(
    (current, index) => !predicate(current, index, list),
    () => false,
    () => true,
    list,
    0
  )
}

export function some<T>(
  predicate: PredicateFn<T>,
  list: LinkedList<T>
): boolean {
  return recursiveFind(
    (current, index) => predicate(current, index, list),
    () => true,
    () => false,
    list,
    0
  )
}

export function includes<T>(value: T, list: LinkedList<T>): boolean {
  return some((v) => v === value, list)
}

export function entries<T>(list: LinkedList<T>): IterableIterator<[number, T]> {
  return iterator(list, (key, value) => [key, value])
}

export function keys<T>(list: LinkedList<T>): IterableIterator<number> {
  return iterator(list, (key) => key)
}

export function values<T>(list: LinkedList<T>): IterableIterator<T> {
  return iterator(list, (_, value) => value)
}

export function get<T>(index: number, list: LinkedList<T>): T | undefined {
  return find((_, idx) => idx === index, list)
}

function recursiveSliceFrom<T>(
  start: number,
  list: LinkedList<T>
): LinkedList<T> {
  return start > 0 ? recursiveSliceFrom(start - 1, rest(list)) : list
}

export function slice<T>(
  start: number,
  end: number,
  list: LinkedList<T>
): LinkedList<T> {
  const size = length(list)
  const slicedList = recursiveSliceFrom(start, list)
  return size > end
    ? reverse(recursiveSliceFrom(size - end, reverse(slicedList)))
    : slicedList
}

function recursiveRemove<T>(
  index: number,
  before: LinkedList<T>,
  after: LinkedList<T>,
  currentIndex: number
): LinkedList<T> {
  return isEmpty(after) || currentIndex >= index
    ? reduce((acc, value) => prepend(value, acc), cdr(after), before)
    : recursiveRemove(
        index,
        prepend(car(after), before),
        cdr(after),
        currentIndex + 1
      )
}

export function remove<T>(index: number, list: LinkedList<T>): LinkedList<T> {
  return recursiveRemove(index, emptyList<T>(), list, 0)
}

export function sort<T>(list: LinkedList<T>): LinkedList<T>
export function sort<T>(
  compare: CompareFn<T>,
  list: LinkedList<T>
): LinkedList<T>
export function sort<T>(
  compareOrList: LinkedList<T> | CompareFn<T>,
  listOrNothing?: LinkedList<T>
): LinkedList<T> {
  const [compare, list] =
    typeof compareOrList === 'function'
      ? [compareOrList, listOrNothing]
      : [undefined, compareOrList]
  // TODO: implement merge sort
  return listOf(...toArray(list).sort(compare))
}
