type Fn<Argument, Result> = (value: Argument) => Result

type Compose1<A, B> = readonly [Fn<A, B>]
type Compose2<A, B, C> = readonly [Fn<A, B>, Fn<B, C>]
type Compose3<A, B, C, D> = readonly [Fn<A, B>, Fn<B, C>, Fn<C, D>]
type Compose4<A, B, C, D, E> = readonly [Fn<A, B>, Fn<B, C>, Fn<C, D>, Fn<D, E>]
type Compose5<A, B, C, D, E, F> = readonly [
  Fn<A, B>,
  Fn<B, C>,
  Fn<C, D>,
  Fn<D, E>,
  Fn<E, F>,
]
type Compose6<A, B, C, D, E, F, G> = readonly [
  Fn<A, B>,
  Fn<B, C>,
  Fn<C, D>,
  Fn<D, E>,
  Fn<E, F>,
  Fn<F, G>,
]
type Compose7<A, B, C, D, E, F, G, H> = readonly [
  Fn<A, B>,
  Fn<B, C>,
  Fn<C, D>,
  Fn<D, E>,
  Fn<E, F>,
  Fn<F, G>,
  Fn<G, H>,
]
type Compose8<A, B, C, D, E, F, G, H, I> = readonly [
  Fn<A, B>,
  Fn<B, C>,
  Fn<C, D>,
  Fn<D, E>,
  Fn<E, F>,
  Fn<F, G>,
  Fn<G, H>,
  Fn<H, I>,
]

export function pipe<A>(initial: A): A
export function pipe<A, B>(initial: A, ...fns: Compose1<A, B>): B
export function pipe<A, B, C>(initial: A, ...fns: Compose2<A, B, C>): C
export function pipe<A, B, C, D>(initial: A, ...fns: Compose3<A, B, C, D>): D
export function pipe<A, B, C, D, E>(
  initial: A,
  ...fns: Compose4<A, B, C, D, E>
): E
export function pipe<A, B, C, D, E, F>(
  initial: A,
  ...fns: Compose5<A, B, C, D, E, F>
): F
export function pipe<A, B, C, D, E, F, G>(
  initial: A,
  ...fns: Compose6<A, B, C, D, E, F, G>
): G
export function pipe<A, B, C, D, E, F, G, H>(
  initial: A,
  ...fns: Compose7<A, B, C, D, E, F, G, H>
): H
export function pipe<A, B, C, D, E, F, G, H, I>(
  initial: A,
  ...fns: Compose8<A, B, C, D, E, F, G, H, I>
): I
export function pipe(
  initial: unknown,
  ...fns: readonly Fn<unknown, unknown>[]
): unknown {
  return fns.reduce((result, fn) => fn(result), initial)
}

export function flow<A, B>(...fns: Compose1<A, B>): Fn<A, B>
export function flow<A, B, C>(...fns: Compose2<A, B, C>): Fn<A, C>
export function flow<A, B, C, D>(...fns: Compose3<A, B, C, D>): Fn<A, D>
export function flow<A, B, C, D, E>(...fns: Compose4<A, B, C, D, E>): Fn<A, E>
export function flow<A, B, C, D, E, F>(
  ...fns: Compose5<A, B, C, D, E, F>
): Fn<A, F>
export function flow<A, B, C, D, E, F, G>(
  ...fns: Compose6<A, B, C, D, E, F, G>
): Fn<A, G>
export function flow<A, B, C, D, E, F, G, H>(
  ...fns: Compose7<A, B, C, D, E, F, G, H>
): Fn<A, H>
export function flow<A, B, C, D, E, F, G, H, I>(
  ...fns: Compose8<A, B, C, D, E, F, G, H, I>
): Fn<A, I>
export function flow(
  ...fns: readonly Fn<unknown, unknown>[]
): Fn<unknown, unknown> {
  return (initial: unknown) => fns.reduce((result, fn) => fn(result), initial)
}
