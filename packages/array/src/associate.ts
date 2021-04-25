export function associate<T, K extends keyof any, V>(
  transform: (value: T) => [K, V],
  array: readonly T[]
): Record<K, V> {
  return array.reduce((previous, current) => {
    const [key, value] = transform(current)
    previous[key] = value
    return previous
  }, {} as Record<K, V>)
}
