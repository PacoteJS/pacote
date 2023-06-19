/**
 * Implements a Least-Recently Updated cache based on a `Map`.
 *
 * @example
 * ```typescript
 * import { LRUCache } from '@pacote/lru-cache'
 *
 * const cache = new LRUCache(1000)
 *
 * cache.set('key', 'value')
 * cache.get('key') // => 'value'
 * ```
 */
export class LRUCache<K, V> {
  private capacity: number
  private pointers = new Map<K, number>()
  private before: Uint32Array
  private after: Uint32Array
  private keys: K[]
  private values: V[]
  private cacheSize = 0
  private head = 0
  private tail = 0

  /**
   * Creates a new instance of the LRU cache.
   *
   * @param capacity  Cache capacity. Any items added over this limit will evict
   *                  the least-recently updated item in cache.
   */
  constructor(capacity: number) {
    this.capacity = capacity
    this.keys = new Array<K>(capacity)
    this.values = new Array<V>(capacity)
    this.before = new Uint32Array(capacity)
    this.after = new Uint32Array(capacity)
  }

  /**
   * Cache size.
   */
  get size() {
    return this.cacheSize
  }

  /**
   * Retrieves the cached item at the provided key, if present.
   *
   * @param key Cache key to look up.
   *
   * @returns Value stored in the cache, or `undefined` if none found.
   */
  get(key: K): V | undefined {
    const pointer = this.pointers.get(key)

    if (pointer === undefined) {
      return undefined
    }

    this.recordAccess(pointer)

    return this.values[pointer]
  }

  /**
   * Checks the membership of a cached item at the provided key. This will not
   * advance the checked entry to the top of the updated stack.
   *
   * @param key Cache key to look up.
   *
   * @returns Whether an item exists with the provided key.
   */
  has(key: K): boolean {
    return this.pointers.has(key)
  }

  /**
   * Updates the cache by setting a cache key to the provided value.
   *
   * @param key    Item cache key.
   * @param value  Item value.
   */
  set(key: K, value: V): void {
    let pointer = this.pointers.get(key)

    if (pointer !== undefined) {
      this.recordAccess(pointer)
      this.values[pointer] = value
      return
    }

    if (this.cacheSize < this.capacity) {
      pointer = this.cacheSize++
    } else {
      pointer = this.evict()
    }

    this.pointers.set(key, pointer)
    this.keys[pointer] = key
    this.values[pointer] = value

    this.after[pointer] = this.head
    this.before[this.head] = pointer
    this.head = pointer
  }

  /**
   * Removes the cached value under the specified key.
   *
   * Note: deleting a cached value will not contract the size of the cache.
   *
   * @param key  Item cache key to remove.
   */
  delete(key: K): void {
    this.pointers.delete(key)
  }

  /**
   * Clears the cache.
   */
  clear() {
    this.cacheSize = 0
    this.head = 0
    this.tail = 0
    this.pointers.clear()
  }

  private recordAccess(pointer: number): void {
    if (this.head === pointer) {
      return
    }

    const pointerBefore = this.before[pointer]
    const pointerAfter = this.after[pointer]

    if (this.tail === pointer) {
      this.tail = pointerBefore
    } else {
      this.before[pointerAfter] = pointerBefore
    }

    this.after[pointerBefore] = pointerAfter
    this.after[pointer] = this.head
    this.head = pointer
  }

  private evict(): number {
    const pointer = this.tail
    this.tail = this.before[pointer]
    this.pointers.delete(this.keys[pointer])
    return pointer
  }
}
