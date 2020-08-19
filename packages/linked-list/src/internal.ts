type Empty = undefined
type Cons<T> = readonly [T, Cons<T> | Empty]
export type LinkedList<T> = Cons<T> | Empty

export type MapFn<T, R> = (
  value: T,
  index: number,
  collection: LinkedList<T>
) => R
export type PredicateFn<T> = MapFn<T, boolean>
export type ReduceFn<T, R> = (
  acc: R,
  value: T,
  index: number,
  collection: LinkedList<T>
) => R

export type CompareFn<T> = (a: T, b: T) => number

export function car<T>(cons: Cons<T>): T {
  return cons[0]
}

export function cdr<T>(cons: Cons<T> | Empty): Cons<T> | Empty {
  return cons?.[1]
}

export function emptyList<T>(): LinkedList<T> {
  return undefined
}

export function isEmpty(list: any): list is Empty {
  return list === undefined
}

export function recursiveReduce<T, R>(
  acc: R,
  reducer: ReduceFn<T, R>,
  current: LinkedList<T>,
  step: number,
  index: number,
  collection: LinkedList<T>
): R {
  return isEmpty(current)
    ? acc
    : recursiveReduce(
        reducer(acc, car(current), index, collection),
        reducer,
        cdr(current),
        step,
        index + step,
        collection
      )
}

export function recursiveFind<T, R>(
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

export function iterator<T, R>(
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
