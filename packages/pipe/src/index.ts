type PipedResult<T> = {
  then<R>(fn: (value: T) => R): PipedResult<R>
  readonly value: T
}

export function pipe<T>(value: T): PipedResult<T> {
  return {
    then: (fn) => pipe(fn(value)),
    value,
  }
}
