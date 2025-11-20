import { LRUCache } from '@pacote/lru-cache'

export interface Options {
  /**
   * Maximum number of cached results. If set, caching will use a least-recently
   * used strategy to evict excess items.
   */
  capacity?: number
}

type Fn<A extends unknown[], R> = (...args: A) => R

export interface MemoizedFn<A extends unknown[], R> extends Fn<A, R> {
  clear(): void
}

/**
 *
 * @param cacheKeyFn A function that generates a string key for cached results.
 *                   This function takes the same arguments as the function to
 *                   memoize.
 * @param fn         The function to memoize.
 * @param options    Memoization options.
 * @returns          Version of the function that caches results.
 *
 * @example
 * ```typescript
 * import { memoize } from '@pacote/memoize'
 *
 * const randomFunction = (prefix: string) => `${prefix}${Math.random()}`
 *
 * const memoizedFunction = memoize((prefix) => `key_${prefix}`, randomFunction)
 *
 * memoizedFunction('foo') // 'foo' followed by randomly-generated number.
 * memoizedFunction('foo') // Same result as previous call with 'foo'.
 *
 * memoizedFunction('bar') // 'bar' followed by randomly-generated number.
 * memoizedFunction('bar') // Same result as previous call with 'bar'.
 * ```
 */

export function memoize<A extends unknown[], K, V>(
  cacheKeyFn: Fn<A, K>,
  fn: Fn<A, V>,
  options: Options = {},
): MemoizedFn<A, V> {
  const cache = options.capacity
    ? new LRUCache<K, V>(options.capacity)
    : new Map<K, V>()

  const memoizedFn: Fn<A, V> = (...args: A) => {
    const key = cacheKeyFn(...args)

    if (!cache.has(key)) {
      cache.set(key, fn(...args))
    }

    // biome-ignore lint/style/noNonNullAssertion: set ensures key exists
    return cache.get(key)!
  }

  return Object.assign(memoizedFn, {
    clear: () => {
      return cache.clear()
    },
  })
}
