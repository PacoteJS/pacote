import { emptyList, LinkedList, prepend, reduce } from './core'

export function listOf<T>(...items: T[]): LinkedList<T> {
  return items
    .reverse()
    .reduce((list, value) => prepend(value, list), emptyList<T>())
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
