export function associate<T, K extends keyof any, V>(
  transform: (value: T) => [K, V],
  array: readonly T[]
): Partial<Record<K, V>> {
  return array.reduce<Partial<Record<K, V>>>((previous, current) => {
    const [key, value] = transform(current)
    previous[key] = value
    return previous
  }, {})
}
