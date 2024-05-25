import { None, type Option, Some } from '@pacote/option'

export function iff<T>(predicate: boolean, onConsequent: () => T): Option<T>
export function iff<T>(
  predicate: boolean,
  onConsequent: () => T,
  onAlternative: () => T,
): T
export function iff<T>(
  predicate: boolean,
  onConsequent: () => T,
  onAlternative?: () => T,
): T | Option<T> {
  return onAlternative
    ? predicate
      ? onConsequent()
      : onAlternative()
    : predicate
      ? Some(onConsequent())
      : None
}
