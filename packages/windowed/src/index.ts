function recursiveWindow<T>(
  acc: T[][],
  collection: T[],
  size: number,
  step: number
): T[][] {
  return collection.length === 0
    ? acc
    : collection.length <= size
    ? [...acc, collection]
    : recursiveWindow(
        [...acc, collection.slice(0, size)],
        collection.slice(step),
        size,
        step
      )
}

export function windowed<T>(size: number, collection: T[]): T[][]
export function windowed<T>(size: number, step: number, collection: T[]): T[][]
export function windowed<T>(
  size: number,
  stepOrCollection: number | T[],
  collection: T[] = []
): T[][] {
  if (size <= 0) {
    throw Error('size must be a positive integer')
  }

  if (Array.isArray(stepOrCollection)) {
    return recursiveWindow([], stepOrCollection, size, 1)
  } else {
    if (stepOrCollection <= 0) {
      throw Error('step must be a positive integer')
    }

    return recursiveWindow([], collection, size, stepOrCollection)
  }
}
