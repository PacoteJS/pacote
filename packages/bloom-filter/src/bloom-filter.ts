import { defaultHash } from './hash'
import type { Options } from './options'

/**
 * A space-efficient probabilistic set for values with a stable `toString()`.
 *
 * Membership checks can produce false positives, but never false negatives.
 * Use `CountingBloomFilter` when values must be removed.
 * The filter uses seeded XXH64 hashing with enhanced double hashing. This hash
 * is non-cryptographic and should not be used for security-sensitive purposes.
 *
 * @typeParam T - Values represented by the filter.
 * @example
 * ```typescript
 * const filter = new BloomFilter({ size: 22056, hashes: 8 })
 * filter.add('foo')
 * filter.has('foo') // => true
 * ```
 */
export class BloomFilter<T extends { toString(): string }> {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: Uint32Array
  private readonly hash: (index: number, element: string) => number

  /**
   * Creates a filter from its size, hash count, and optional seed or bit data.
   *
   * @param options - Filter size, hash count, and optional initial state.
   * @returns A new Bloom filter.
   * @throws Error if `size` or `hashes` is less than 1.
   */
  constructor(options: Options) {
    if (options.size < 1) {
      throw Error('size must be greater than 0')
    }

    if (options.hashes < 1) {
      throw Error('number of hashes must be greater than 0')
    }

    this.size = options.size
    this.hashes = options.hashes
    this.seed = options.seed ?? 0x00c0ffee
    this.filter = options.filter ?? new Uint32Array(Math.ceil(this.size / 32))
    this.hash = options.hash ?? defaultHash(this.seed)
  }

  /**
   * Adds an element to the filter.
   * @param element - Value to add.
   */
  add(element: T): void {
    const str = element.toString()
    for (let i = 0; i < this.hashes; i++) {
      const hashedValue = this.hash(i, str) % this.size
      const position = Math.floor(hashedValue / 32)
      this.filter[position] |= 1 << (hashedValue % 32)
    }
  }

  /**
   * Checks whether an element may be present in the filter.
   * @param element - Value to look up.
   * @returns `false` guarantees the element is absent; `true` means it may be
   * present and can be a false positive.
   */
  has(element: T): boolean {
    const str = element.toString()
    for (let i = 0; i < this.hashes; i++) {
      const hashedValue = this.hash(i, str) % this.size
      const position = Math.floor(hashedValue / 32)
      if (!(this.filter[position] & (1 << (hashedValue % 32)))) {
        return false
      }
    }
    return true
  }

  /**
   * Returns the filter state in a JSON-serialisable form.
   * @returns Filter size, hash count, seed, and bit data.
   */
  toJSON(): SerialisedBloomFilter {
    return {
      filter: Array.from(this.filter),
      hashes: this.hashes,
      seed: this.seed,
      size: this.size,
    }
  }
}

export interface SerialisedBloomFilter {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: number[]
}
