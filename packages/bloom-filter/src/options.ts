/** Configuration used to construct a Bloom filter. */
export interface Options {
  /** Number of bits in a standard filter or counters in a counting filter. */
  readonly size: number
  /** Number of independent hash positions used for each value. */
  readonly hashes: number
  /** Seed for the filter's hash function; defaults to `0x00c0ffee`. */
  readonly seed?: number
  /** Existing filter data used to restore a previously serialised filter. */
  readonly filter?: Uint32Array
  /** Optional custom hash function. */
  readonly hash?: (index: number, data: string) => number
}
