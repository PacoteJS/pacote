type Fn<A extends any[], R> = (...args: A) => R

interface Cache<R> {
  [key: string]: R
}

function createCache<R>() {
  const cache: Cache<R> = {}

  return {
    has: (key: string) => Object.hasOwnProperty.call(cache, key),

    get: (key: string) => cache[key],

    set: (key: string, value: R) => {
      cache[key] = value
    }
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

    return cache.get(key)
  }
}
