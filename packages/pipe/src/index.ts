type PipeFunctor<T> = {
  map<R>(fn: (value: T) => R): PipeFunctor<R>
  readonly value: T
}

export function pipe<T>(value: T): PipeFunctor<T> {
  return {
    map: (fn) => pipe(fn(value)),
    value,
  }
}
