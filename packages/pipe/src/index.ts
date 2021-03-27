type Fn<Argument = unknown, Result = unknown> = (value: Argument) => Result

type Compose1<A, B> = readonly [Fn<A, B>]
type Compose2<A, B, C> = readonly [Fn<A, B>, Fn<B, C>]
type Compose3<A, B, C, D> = readonly [Fn<A, B>, Fn<B, C>, Fn<C, D>]
type Compose4<A, B, C, D, E> = readonly [Fn<A, B>, Fn<B, C>, Fn<C, D>, Fn<D, E>]
type Compose5<A, B, C, D, E, F> = readonly [
  Fn<A, B>,
  Fn<B, C>,
  Fn<C, D>,
  Fn<D, E>,
  Fn<E, F>
]

export function pipe<A>(initial: A): A
export function pipe<A, B>(initial: A, ...fns: Compose1<A, B>): B
export function pipe<A, B, C>(initial: A, ...fns: Compose2<A, B, C>): C
export function pipe<A, B, C, D>(initial: A, ...fns: Compose3<A, B, C, D>): D
export function pipe<A, B, C, D, E>(
  initial: A,
  ...fns: Compose4<A, B, C, D, E>
): D
export function pipe<A, B, C, D, E, F>(
  initial: A,
  ...fns: Compose5<A, B, C, D, E, F>
): D
export function pipe(initial: unknown, ...fns: readonly Fn[]): unknown {
  return fns.reduce((acc, fn) => fn(acc), initial)
}

export function flow<A, B>(...fns: Compose1<A, B>): Fn<A, B>
export function flow<A, B, C>(...fns: Compose2<A, B, C>): Fn<A, C>
export function flow<A, B, C, D>(...fns: Compose3<A, B, C, D>): Fn<A, D>
export function flow<A, B, C, D, E>(...fns: Compose4<A, B, C, D, E>): Fn<A, E>
export function flow<A, B, C, D, E, F>(
  ...fns: Compose5<A, B, C, D, E, F>
): Fn<A, F>
export function flow(...fns: readonly Fn[]): Fn {
  return (initial: unknown) => fns.reduce((acc, fn) => fn(acc), initial)
}
