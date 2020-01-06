export type Immutable<T> = T extends Array<infer E>
  ? ImmutableArray<E>
  : T extends Map<infer K, infer V>
  ? ImmutableMap<K, V>
  : T extends Set<infer E>
  ? ImmutableSet<E>
  : T extends object
  ? ImmutableObject<T>
  : T

type ImmutableArray<T> = ReadonlyArray<Immutable<T>>
type ImmutableObject<T> = { readonly [P in keyof T]: Immutable<T[P]> }
type ImmutableMap<K, T> = ReadonlyMap<K, Immutable<T>>
type ImmutableSet<T> = ReadonlySet<Immutable<T>>
