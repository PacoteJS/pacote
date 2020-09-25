import { listOf } from './array'
import {
  LinkedList,
  isEmpty,
  concat,
  prepend,
  car,
  cdr,
  reverse,
  length,
} from './core'
import { drop, take } from './sublists'

export type CompareFn<T> = (a: T, b: T) => number

function defaultCompare<T>(a: T, b: T): number {
  if (a === undefined && b === undefined) return 0
  if (a === undefined) return 1
  if (b === undefined) return -1
  if (String(a) < String(b)) return -1
  if (String(a) > String(b)) return 1
  return 0
}

function merge<T>(
  compare: CompareFn<T>,
  result: LinkedList<T>,
  left: LinkedList<T>,
  right: LinkedList<T>
): LinkedList<T> {
  return isEmpty(left) || isEmpty(right)
    ? concat(reverse(result), concat(left, right))
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

  const middle = Math.ceil(length(list) / 2)

  return merge(
    compare,
    listOf<T>(),
    mergeSort(compare, take(middle, list)),
    mergeSort(compare, drop(middle, list))
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
