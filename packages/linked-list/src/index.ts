import * as O from '@pacote/option'
import { None, Some, Option } from '@pacote/option'
import {
  car,
  cdr,
  CompareFn,
  emptyList,
  isEmpty,
  LinkedList,
  MapFn,
  PredicateFn,
  recursiveFind,
  recursiveReduce,
  ReduceFn,
} from './core'
import { defaultCompare } from './sort'

export { isEmpty, cdr as rest } from './core'
export { entries, keys, values } from './iterator'

export function listOf<T>(...items: T[]): LinkedList<T> {
  return items
    .reverse()
    .reduce((list, value) => prepend(value, list), emptyList<T>())
}

export function length<T>(list: LinkedList<T>): number {
  return reduce((count) => count + 1, 0, list)
}

export function head<T>(list: LinkedList<T>): Option<T> {
  return isEmpty(list) ? None : Some(car(list))
}

export function reverse<T>(list: LinkedList<T>): LinkedList<T> {
  return reduce((acc, value) => prepend(value, acc), emptyList(), list)
}

export function tail<T>(list: LinkedList<T>): Option<T> {
  return reduce<T, Option<T>>((_, value) => Some(value), None, list)
}

export function prepend<T>(value: T, list: LinkedList<T>): LinkedList<T> {
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
      emptyList(),
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
      emptyList(),
      list
    )
  )
}

export function indexOf<T>(value: T, list: LinkedList<T>): Option<number> {
  return recursiveFind<T, Option<number>>(
    (current) => current === value,
    (_, index) => Some(index),
    () => None,
    list,
    0
  )
}

export function lastIndexOf<T>(value: T, list: LinkedList<T>): Option<number> {
  return O.map(
    (lastIndex) => length(list) - lastIndex - 1,
    recursiveFind<T, Option<number>>(
      (current) => current === value,
      (_, index) => Some(index),
      () => None,
      reverse(list),
      0
    )
  )
}

export function find<T>(
  predicate: PredicateFn<T>,
  list: LinkedList<T>
): Option<T> {
  return recursiveFind<T, Option<T>>(
    (current, index) => predicate(current, index, list),
    Some,
    () => None,
    list,
    0
  )
}

export function findIndex<T>(
  predicate: PredicateFn<T>,
  list: LinkedList<T>
): Option<number> {
  return recursiveFind<T, Option<number>>(
    (current, index) => predicate(current, index, list),
    (_, index) => Some(index),
    () => None,
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

export function get<T>(index: number, list: LinkedList<T>): Option<T> {
  return find((_, idx) => idx === index, list)
}

function sliceFromStart<T>(offset: number, list: LinkedList<T>): LinkedList<T> {
  return offset > 0 ? sliceFromStart(offset - 1, cdr(list)) : list
}

function sliceFromEnd<T>(offset: number, list: LinkedList<T>): LinkedList<T> {
  return offset > 0 ? reverse(sliceFromStart(offset, reverse(list))) : list
}

export function slice<T>(start: number, list: LinkedList<T>): LinkedList<T>
export function slice<T>(
  start: number,
  end: number,
  list: LinkedList<T>
): LinkedList<T>
export function slice<T>(
  start: number,
  end: number | LinkedList<T>,
  list?: LinkedList<T>
): LinkedList<T> {
  return typeof end !== 'number'
    ? sliceFromStart(start, end)
    : sliceFromEnd(length(list) - end, sliceFromStart(start, list))
}

export function remove<T>(index: number, list: LinkedList<T>): LinkedList<T> {
  return concat(
    sliceFromEnd(length(list) - index, list),
    sliceFromStart(index + 1, list)
  )
}

function merge<T>(
  compare: CompareFn<T>,
  result: LinkedList<T>,
  left: LinkedList<T>,
  right: LinkedList<T>
): LinkedList<T> {
  return isEmpty(left) || isEmpty(right)
    ? concat(concat(reverse(result), left), right)
    : compare(car(left), car(right)) > 0
    ? merge(compare, prepend(car(right), result), left, cdr(right))
    : merge(compare, prepend(car(left), result), cdr(left), right)
}

function mergeSort<T>(
  compare: CompareFn<T>,
  list: LinkedList<T>
): LinkedList<T> {
  if (isEmpty(cdr(list))) {
    return list
  }

  const size = length(list)
  const middle = Math.floor(size / 2)

  return merge(
    compare,
    listOf<T>(),
    mergeSort(compare, slice(0, middle, list)),
    mergeSort(compare, slice(middle, size, list))
  )
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
      : [defaultCompare, compareOrList]

  return mergeSort(compare, list)
}
