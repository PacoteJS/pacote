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
  index: number
): R {
  return isEmpty(current)
    ? onFinished()
    : predicate(car(current), index)
    ? onFound(car(current), index)
    : recursiveFind(predicate, onFound, onFinished, cdr(current), index + 1)
}

export function find<T>(
  predicate: PredicateFunction<T>,
  list: LinkedList<T>
): Option<T> {
  return recursiveFind<T, Option<T>>(
    (current, index) => predicate(current, index, list),
    Some,
    fnNone,
    list,
    0
  )
}

export function get<T>(index: number, list: LinkedList<T>): Option<T> {
  const intIndex = Math.trunc(index)
  return find((_, idx) => idx === intIndex, list)
}

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

export function every<T>(
  predicate: PredicateFunction<T>,
  list: LinkedList<T>
): boolean {
  return recursiveFind(
    (current, index) => !predicate(current, index, list),
    fnFalse,
    fnTrue,
    list,
    0
  )
}

export function some<T>(
  predicate: PredicateFunction<T>,
  list: LinkedList<T>
): boolean {
  return recursiveFind(
    (current, index) => predicate(current, index, list),
    fnTrue,
    fnFalse,
    list,
    0
  )
}

export function includes<T>(value: T, list: LinkedList<T>): boolean {
  return some((v) => v === value, list)
}

export function indexOf<T>(value: T, list: LinkedList<T>): Option<number> {
  return recursiveFind<T, Option<number>>(
    (current) => current === value,
    (_, index) => Some(index),
    fnNone,
    list,
    0
  )
}

export function lastIndexOf<T>(value: T, list: LinkedList<T>): Option<number> {
  return map(
    (lastIndex: number) => length(list) - lastIndex - 1,
    recursiveFind<T, Option<number>>(
      (current) => current === value,
      (_, index) => Some(index),
      fnNone,
      reverse(list),
      0
    )
  )
}

export function findIndex<T>(
  predicate: PredicateFunction<T>,
  list: LinkedList<T>
): Option<number> {
  return recursiveFind<T, Option<number>>(
    (current, index) => predicate(current, index, list),
    (_, index) => Some(index),
    fnNone,
    list,
    0
  )
}
