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
