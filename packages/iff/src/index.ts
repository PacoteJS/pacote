import { None, type Option, Some } from '@pacote/option'

/**
 * Evaluates a condition and returns the consequent in an `Option`.
 *
 * @param predicate - Condition to evaluate.
 * @param onConsequent - Callback used when the condition is true.
 * @returns `Some` of the callback result when true, or `None` when false.
 * @example
 * ```typescript
 * import { iff } from '@pacote/iff'
 * import { Some } from '@pacote/option'
 *
 * iff(true, () => 1, () => 0) // => 1
 * iff(false, () => 1) // => None
 * iff(false, () => 1, () => 0) // => 0
 * iff(true, () => Some(1)) // => Some(1)
 * // iff(true, () => 1, () => 'zero') // TypeScript error: branch types differ
 * ```
 */
export function iff<T>(predicate: boolean, onConsequent: () => T): Option<T>
/**
 * Evaluates a condition and calls the matching branch.
 *
 * @param predicate - Condition to evaluate.
 * @param onConsequent - Callback used when the condition is true.
 * @param onAlternative - Callback used when the condition is false.
 * @returns The result returned by the selected callback.
 */
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
