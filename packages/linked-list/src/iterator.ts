import { type LinkedList, car, cdr, isEmpty } from './core'

function iterator<T, R>(
  list: LinkedList<T>,
  transformer: (key: number, value: T) => R,
): IterableIterator<R> {
  let key = 0
  let current = list

  return {
    [Symbol.iterator]: function () {
      return this
    },
    next() {
      if (isEmpty(current)) {
        return { done: true, value: undefined }
      }
      const value = transformer(key++, car(current))
      current = cdr(current)
      return { done: false, value }
    },
  }
}

/**
 * Returns a new [iterator object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
 * that contains the key/value pairs for each index in the list.
 *
 * @param list Linked list.
 *
 * @returns Entry iterator.
 *
 * @category Iterator
 */
export function entries<T>(list: LinkedList<T>): IterableIterator<[number, T]> {
  return iterator(list, (key, value) => [key, value])
}

/**
 * Returns a new [iterator object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
 * that contains the keys for each index in the list.
 *
 * @param list Linked list.
 *
 * @returns Key iterator.
 *
 * @category Iterator
 */
export function keys<T>(list: LinkedList<T>): IterableIterator<number> {
  return iterator(list, (key) => key)
}

/**
 * Returns a new [iterator object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
 * that contains the values for each index in the list.
 *
 * @param list Linked list.
 *
 * @returns Value iterator.
 *
 * @category Iterator
 */
export function values<T>(list: LinkedList<T>): IterableIterator<T> {
  return iterator(list, (_, value) => value)
}
