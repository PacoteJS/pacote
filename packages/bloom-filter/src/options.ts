/** Hash function for a Bloom filter, returning a value for each hash index. */
export type HashFunction = (index: number, data: string) => number

/** Configuration used to construct a Bloom filter. */
export interface Options {
  /** Number of bits in a standard filter or counters in a counting filter. */
  readonly size: number
  /** Number of independent hash positions used for each value. */
  readonly hashes: number
  /** Seed for the filter's hash function; defaults to `0x00c0ffee`. */
  readonly seed?: number
  /** Existing filter data used to restore a previously serialised filter. */
  readonly filter?: Uint32Array | readonly number[]
  /** Optional custom hash function. */
  readonly hash?: HashFunction
}
