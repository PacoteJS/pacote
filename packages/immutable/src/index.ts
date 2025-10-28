/**
 * Generic type that converts deeply nested structures into immutable variants.
 *
 * Useful when you want to treat mutable shapes such as arrays, maps, sets, and
 * plain objects as readonly data structures throughout your application.
 *
 * @example
 * import type { Immutable } from '@pacote/immutable'
 *
 * type Foo = { foo: string }
 *
 * const mutable: Foo[] = [{ foo: 'bar' }]
 *
 * // Allowed:
 * mutable.push({ foo: 'baz' })
 * mutable[0].foo = 'baz'
 * delete mutable[0].foo
 *
 * const immutable: Immutable<Foo[]> = [{ foo: 'bar' }]
 *
 * // Not allowed:
 * immutable.push({ foo: 'baz' })
 * immutable[0].foo = 'baz'
 * delete immutable[0].foo
 */
export type Immutable<T> = T extends readonly [infer First, ...infer Rest]
  ? readonly [Immutable<First>, ...ImmutableTuple<Rest>]
  : T extends readonly (infer E)[]
    ? ReadonlyArray<Immutable<E>>
    : T extends Map<infer K, infer V>
      ? ReadonlyMap<Immutable<K>, Immutable<V>>
      : T extends Set<infer E>
        ? ReadonlySet<Immutable<E>>
        : T extends Record<string, infer V>
          ? { readonly [P in keyof T]: Immutable<V> }
          : T

// biome-ignore lint/suspicious/noExplicitAny: extend tuples of any type
export type ImmutableTuple<T extends readonly any[]> = T extends readonly [
  infer F,
  ...infer R,
]
  ? readonly [Immutable<F>, ...ImmutableTuple<R>]
  : readonly []
