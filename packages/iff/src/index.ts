import { Option, some, none } from 'fp-ts/lib/Option'

export function iff<T>(predicate: boolean, onConsequent: () => T): Option<T>
export function iff<T>(
  predicate: boolean,
  onConsequent: () => T,
  onAlternative: () => T
): T
export function iff<T>(
  predicate: boolean,
  onConsequent: () => T,
  onAlternative?: () => T
): T | Option<T> {
  return onAlternative != null
    ? predicate
      ? onConsequent()
      : onAlternative()
    : predicate
    ? some(onConsequent())
    : none
}
