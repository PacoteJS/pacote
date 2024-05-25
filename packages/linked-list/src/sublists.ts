import {
  type LinkedList,
  car,
  cdr,
  concat,
  emptyList,
  isEmpty,
  prepend,
  reduce,
  reverse,
} from './core'
import { includes } from './search'

/**
 * Drops an arbitrary number of items from the start of a list.
 *
 * @param offset  Number of items to drop.
 * @param list    Linked list.
 *
 * @returns A new linked list with the first `offset` list items removed.
 *
 * @category Sublist
 */
export function drop<T>(offset: number, list: LinkedList<T>): LinkedList<T> {
  return offset > 0 ? drop(offset - 1, cdr(list)) : list
}

function recursiveTake<T>(
  acc: LinkedList<T>,
  offset: number,
  list: LinkedList<T>,
): LinkedList<T> {
  return offset > 0 && !isEmpty(list)
    ? recursiveTake(prepend(car(list), acc), offset - 1, cdr(list))
    : reverse(acc)
}

/**
 * Take an arbitrary number of items from the start of a list.
 *
 * @param offset  Number of items to return.
 * @param list    Linked list.
 *
 * @returns A new linked list with the first `offset` items of the list.
 *
 * @category Sublist
 */
export function take<T>(offset: number, list: LinkedList<T>): LinkedList<T> {
  return recursiveTake(emptyList(), offset, list)
}

/**
 * Creates a subset of elements from a start index (inclusive) till the end of
 * the list.
 *
 * @param start  Starting index (inclusive).
 * @param list   Linked list.
 *
 * @returns A new linked list with a subset of elements between `start` and
 *          the end of the list.
 *
 * @category Sublist
 */
export function slice<T>(start: number, list: LinkedList<T>): LinkedList<T>
/**
 * Creates a subset of elements from a start index (inclusive) to an end
 * index (non-inclusive) of the list.
 *
 * @param start  Starting index (inclusive).
 * @param end    Ending index (non-inclusive).
 * @param list   Linked list.
 *
 * @returns A new linked list with a subset of elements between `start` and
 *          `end` of the list.
 *
 * @category Sublist
 */
export function slice<T>(
  start: number,
  end: number,
  list: LinkedList<T>,
): LinkedList<T>
export function slice<T>(
  start: number,
  end: number | LinkedList<T>,
  list?: LinkedList<T>,
): LinkedList<T> {
  const startOffset = start > 0 ? start : 0
  return typeof end !== 'number'
    ? drop(startOffset, end)
    : take(end - startOffset, drop(startOffset, list))
}

/**
 * Removes the item at a specified index from a list.
 *
 * @param index  Index of the item to remove.
 * @param list   Linked list.
 *
 * @returns A new linked list with the item at index `index` removed.
 *
 * @category Sublist
 */
export function remove<T>(index: number, list: LinkedList<T>): LinkedList<T> {
  return concat(take(index, list), drop(index + 1, list))
}

/**
 * Get the unique items of a list.
 *
 * @param list Linked list.
 *
 * @returns A new linked list with a subset of elements that are unique.
 *
 * @category Sublist
 */
export function unique<T>(list: LinkedList<T>): LinkedList<T> {
  return reverse(
    reduce(
      (uniqueValues, value) =>
        includes(value, uniqueValues)
          ? uniqueValues
          : prepend(value, uniqueValues),
      emptyList(),
      list,
    ),
  )
}
