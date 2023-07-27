import { emptyList, LinkedList, prepend, reduce } from './core'

/**
 * Create a new singly linked list with the arguments passed as items.
 *
 * @param items List elements.
 *
 * @returns Linked list with the provided elements.
 */
export function listOf<T>(...items: T[]): LinkedList<T> {
  return items
    .reverse()
    .reduce((list, value) => prepend(value, list), emptyList<T>())
}

/**
 * Turn a linked list into its equivalent array representation.
 *
 * @param list Linked list.
 *
 * @returns Array version of the linked list.
 *
 * @category Conversion
 */
export function toArray<T>(list: LinkedList<T>): T[] {
  return reduce<T, T[]>(
    (acc, value) => {
      acc.push(value)
      return acc
    },
    [],
    list,
  )
}
