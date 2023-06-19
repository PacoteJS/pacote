import { LRUCache } from '@pacote/lru-cache'

export type Options = {
  capacity?: number
}

type Fn<A extends any[], R> = (...args: A) => R

type MemoizedFn<A extends any[], R> = Fn<A, R> & {
  clear(): void
}

export function memoize<A extends any[], K, V>(
  cacheKeyFn: Fn<A, K>,
  fn: Fn<A, V>,
  options: Options = {}
): MemoizedFn<A, V> {
  const cache = options.capacity
    ? new LRUCache<K, V>(options.capacity)
    : new Map<K, V>()

  const memoizedFn: Fn<A, V> = (...args: A) => {
    const key = cacheKeyFn(...args)

    if (!cache.has(key)) {
      cache.set(key, fn(...args))
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cache.get(key)!
  }

  return Object.assign(memoizedFn, {
    clear: () => {
      return cache.clear()
    },
  })
}
