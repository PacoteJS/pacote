import { defaultHash } from './hash'
import type { HashFunction, Options } from './options'

/**
 * A counting Bloom filter that tracks approximate membership counts and
 * supports removal.
 *
 * Like a standard Bloom filter, it can report false positives. The returned
 * count is therefore a possible count, not proof of exact membership.
 *
 * @typeParam T - Values represented by the filter.
 */
export class CountingBloomFilter<T extends { toString(): string }> {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: Uint32Array
  private hash: HashFunction

  /**
   * Creates a counting filter from its size, hash count, and optional seed or counters.
   *
   * @param options - Filter size, hash count, and optional initial state.
   * @returns A new counting Bloom filter.
   * @throws Error if `size` or `hashes` is not a positive integer, or if
   * `filter` does not hold `size` counters.
   */
  constructor(options: Options) {
    if (!Number.isInteger(options.size) || options.size < 1) {
      throw Error('size must be a positive integer')
    }

    if (!Number.isInteger(options.hashes) || options.hashes < 1) {
      throw Error('number of hashes must be a positive integer')
    }

    if (options.filter && options.filter.length !== options.size) {
      throw Error('filter data does not match the size')
    }

    this.size = options.size
    this.hashes = options.hashes
    this.seed = options.seed ?? 0x00c0ffee
    this.filter = options.filter
      ? Uint32Array.from(options.filter)
      : new Uint32Array(this.size)
    this.hash = options.hash ?? defaultHash(this.seed)
  }

  /**
   * Adds an instance of an element and increments its counters.
   * @param element - Value to add.
   */
  add(element: T): void {
    for (let i = 0; i < this.hashes; i++) {
      const position = this.hashPosition(i, element)
      this.filter[position] += 1
    }
  }

  /**
   * Removes an instance of an element without allowing counters below zero.
   * @param element - Value to remove.
   */
  remove(element: T): void {
    for (let i = 0; i < this.hashes; i++) {
      const position = this.hashPosition(i, element)
      if (this.filter[position] > 0) {
        this.filter[position] -= 1
      }
    }
  }

  /**
   * Returns the possible number of times an element was added.
   * @param element - Value to look up.
   * @returns The minimum counter value for this element's hash positions.
   */
  has(element: T): number {
    let min = Number.POSITIVE_INFINITY
    for (let i = 0; i < this.hashes; i++) {
      const position = this.hashPosition(i, element)
      min = Math.min(min, this.filter[position])
    }
    return min
  }

  /**
   * Returns the filter state in a JSON-serialisable form.
   * @returns Filter size, hash count, seed, and counter data.
   */
  toJSON(): SerialisedCountingBloomFilter {
    return {
      filter: Array.from(this.filter),
      hashes: this.hashes,
      seed: this.seed,
      size: this.size,
    }
  }

  private hashPosition(i: number, element: T): number {
    return this.hash(i, element.toString()) % this.size
  }
}

export interface SerialisedCountingBloomFilter {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: number[]
}
