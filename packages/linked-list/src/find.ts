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

function recursiveFind<T, R>(
  predicate: (value: T, index: number) => boolean,
  whenFound: (current: T, index: number) => R,
  whenFinished: () => R,
  current: LinkedList<T>,
  index: number
): R {
  return isEmpty(current)
    ? whenFinished()
    : predicate(car(current), index)
    ? whenFound(car(current), index)
    : recursiveFind(predicate, whenFound, whenFinished, cdr(current), index + 1)
}

export function find<T>(
  predicate: PredicateFunction<T>,
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

export function get<T>(index: number, list: LinkedList<T>): Option<T> {
  return find((_, idx) => idx === index, list)
}

export function every<T>(
  predicate: PredicateFunction<T>,
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
  predicate: PredicateFunction<T>,
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
  return map(
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

export function findIndex<T>(
  predicate: PredicateFunction<T>,
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
