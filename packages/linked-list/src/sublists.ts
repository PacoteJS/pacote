import {
  car,
  cdr,
  concat,
  LinkedList,
  reverse,
  emptyList,
  prepend,
  isEmpty,
} from './core'

export function drop<T>(offset: number, list: LinkedList<T>): LinkedList<T> {
  return offset > 0 ? drop(offset - 1, cdr(list)) : list
}

function recursiveTake<T>(
  acc: LinkedList<T>,
  offset: number,
  list: LinkedList<T>
): LinkedList<T> {
  return offset > 0 && !isEmpty(list)
    ? recursiveTake(prepend(car(list), acc), offset - 1, cdr(list))
    : reverse(acc)
}

export function take<T>(offset: number, list: LinkedList<T>): LinkedList<T> {
  return recursiveTake(emptyList(), offset, list)
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
  const startOffset = start > 0 ? start : 0
  return typeof end !== 'number'
    ? drop(startOffset, end)
    : take(end - startOffset, drop(startOffset, list))
}

export function remove<T>(index: number, list: LinkedList<T>): LinkedList<T> {
  return concat(take(index, list), drop(index + 1, list))
}
