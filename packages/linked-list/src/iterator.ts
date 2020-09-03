import { car, cdr, isEmpty, LinkedList } from './core'

function iterator<T, R>(
  list: LinkedList<T>,
  result: (key: number, value: T) => R
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
      } else {
        const value = result(key++, car(current))
        current = cdr(current)
        return { done: false, value }
      }
    },
  }
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
