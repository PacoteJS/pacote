/**
 * Creates a new record from an array of arbitrary values passing each through a
 * transformation function to obtain tuples of the target record's keys and
 * values.
 *
 * @example
 * ```typescript
 * import { associate } from '@pacote/array'
 *
 * associate((s) => [s, s.length], ['abc', 'd']) // => { 'abc': 3, 'd': 1 }
 * ```
 *
 * @param transform Transformation function.
 * @param array Array to transform into a `Record`.
 * @returns Record version of the array with the computed keys and values.
 */
export function associate<T, K extends keyof any, V>(
  transform: (value: T) => [K, V],
  array: readonly T[],
): Record<K, V> {
  return array.reduce(
    (previous, current) => {
      const [key, value] = transform(current)
      previous[key] = value
      return previous
    },
    {} as Record<K, V>,
  )
}
