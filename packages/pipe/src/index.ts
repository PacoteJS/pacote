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

/**
 * Passes a value through a sequence of functions from left to right.
 *
 * @param initial - Value passed to the first function.
 * @returns The result returned by the last function, or `initial` when no
 * functions are supplied.
 * @example
 * ```typescript
 * import { pipe } from '@pacote/pipe'
 *
 * const doubleSay = (value: string) => `${value}, ${value}`
 * const capitalize = (value: string) =>
 *   value.charAt(0).toUpperCase() + value.slice(1)
 * const exclaim = (value: string) => `${value}!`
 *
 * pipe('hello', doubleSay, capitalize, exclaim)
 * // => 'Hello, hello!'
 * // equivalent to exclaim(capitalize(doubleSay('hello')))
 * ```
*/
export function pipe<A>(initial: A): A
/**
 * Passes `initial` through functions from left to right.
 * @param initial - Value passed to the first function.
 * @param fns - Functions applied in order; each receives the previous result.
 * @returns The result returned by the last function.
 */
export function pipe<A, B>(initial: A, ...fns: Compose1<A, B>): B
/**
 * Passes `initial` through functions from left to right.
 * @param initial - Value passed to the first function.
 * @param fns - Functions applied in order; each receives the previous result.
 * @returns The result returned by the last function.
 */
export function pipe<A, B, C>(initial: A, ...fns: Compose2<A, B, C>): C
/**
 * Passes `initial` through functions from left to right.
 * @param initial - Value passed to the first function.
 * @param fns - Functions applied in order; each receives the previous result.
 * @returns The result returned by the last function.
 */
export function pipe<A, B, C, D>(initial: A, ...fns: Compose3<A, B, C, D>): D
/**
 * Passes `initial` through functions from left to right.
 * @param initial - Value passed to the first function.
 * @param fns - Functions applied in order; each receives the previous result.
 * @returns The result returned by the last function.
 */
export function pipe<A, B, C, D, E>(
  initial: A,
  ...fns: Compose4<A, B, C, D, E>
): E
/**
 * Passes `initial` through functions from left to right.
 * @param initial - Value passed to the first function.
 * @param fns - Functions applied in order; each receives the previous result.
 * @returns The result returned by the last function.
 */
export function pipe<A, B, C, D, E, F>(
  initial: A,
  ...fns: Compose5<A, B, C, D, E, F>
): F
/**
 * Passes `initial` through functions from left to right.
 * @param initial - Value passed to the first function.
 * @param fns - Functions applied in order; each receives the previous result.
 * @returns The result returned by the last function.
 */
export function pipe<A, B, C, D, E, F, G>(
  initial: A,
  ...fns: Compose6<A, B, C, D, E, F, G>
): G
/**
 * Passes `initial` through functions from left to right.
 * @param initial - Value passed to the first function.
 * @param fns - Functions applied in order; each receives the previous result.
 * @returns The result returned by the last function.
 */
export function pipe<A, B, C, D, E, F, G, H>(
  initial: A,
  ...fns: Compose7<A, B, C, D, E, F, G, H>
): H
/**
 * Passes `initial` through functions from left to right.
 * @param initial - Value passed to the first function.
 * @param fns - Functions applied in order; each receives the previous result.
 * @returns The result returned by the last function.
 */
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

/**
 * Composes functions into a new function that applies them from left to right.
 *
 * @param fns - Functions to apply in order.
 * @returns A function that accepts the first input and returns the final result.
 * @example
 * ```typescript
 * import { flow } from '@pacote/pipe'
 *
 * const doubleSay = (value: string) => `${value}, ${value}`
 * const capitalize = (value: string) =>
 *   value.charAt(0).toUpperCase() + value.slice(1)
 * const exclaim = (value: string) => `${value}!`
 *
 * const transform = flow(doubleSay, capitalize, exclaim)
 * transform('hello') // => 'Hello, hello!'
 * // equivalent to (value) => exclaim(capitalize(doubleSay(value)))
 * ```
 */
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
