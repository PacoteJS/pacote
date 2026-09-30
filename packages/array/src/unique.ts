/**
 * Returns a new array containing the first occurrence of each distinct value.
 *
 * @param array - Values to deduplicate.
 * @returns A new array with duplicates removed, preserving their first-seen order.
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}
