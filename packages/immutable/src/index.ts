export type Immutable<T> = T extends Array<infer E>
  ? ImmutableArray<E>
  : T extends Map<infer K, infer V>
  ? ImmutableMap<K, V>
  : T extends Set<infer E>
  ? ImmutableSet<E>
  : T extends Record<string, infer V>
  ? ImmutableObject<T, V>
  : T

type ImmutableArray<T> = ReadonlyArray<Immutable<T>>
type ImmutableObject<T, V> = { readonly [P in keyof T]: Immutable<V> }
type ImmutableMap<K, V> = ReadonlyMap<K, Immutable<V>>
type ImmutableSet<T> = ReadonlySet<Immutable<T>>
