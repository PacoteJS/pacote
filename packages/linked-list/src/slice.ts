import { cdr, concat, length, LinkedList, reverse } from './core'

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
