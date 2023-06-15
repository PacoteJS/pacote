type Fn<A extends any[], R> = (...args: A) => R

function createCache<R>() {
  const cache = new Map<string, R>()

  return {
    has: (key: string) => cache.has(key),
    get: (key: string) => cache.get(key),
    set: (key: string, value: R) => cache.set(key, value),
  }
}

export function memoize<A extends any[], R>(
  cacheKeyFn: Fn<A, string>,
  fn: Fn<A, R>
): Fn<A, R> {
  const cache = createCache<R>()

  return (...args) => {
    const key = cacheKeyFn(...args)

    if (!cache.has(key)) {
      cache.set(key, fn(...args))
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cache.get(key)!
  }
}
