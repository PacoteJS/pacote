export type Immutable<T> = T extends any[]
  ? ImmutableArray<T[number]>
  : T extends object
  ? ImmutableObject<T>
  : T

interface ImmutableArray<T> extends ReadonlyArray<Immutable<T>> {}

type ImmutableObject<T> = { readonly [P in keyof T]: Immutable<T[P]> }
