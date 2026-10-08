/**
 * Hash function for a Ribbon filter, returning a 32-bit value for each index:
 * 0 for the start row, 1 for the coefficients, and 2 for the fingerprint.
 * Double hashing schemes, such as the one used by Bloom filters, work.
 */
export type HashFunction = (index: number, data: string) => number

interface CommonOptions {
  /** Number of rows in the solution table. */
  readonly size: number
  /** Bits per fingerprint, between 1 and 32; the false positive rate is 2^-bits. */
  readonly fingerprintBits: number
  /** Seed for the default hash function; defaults to `0x00c0ffee`. */
  readonly seed?: number
  /** Optional custom hash function. */
  readonly hash?: HashFunction
}

/** Configuration used to build a Ribbon filter from its elements. */
export interface BuildOptions<T> extends CommonOptions {
  /** Complete set of elements to build the filter from. */
  readonly elements: Iterable<T>
  readonly filter?: never
}

/** Configuration used to restore a previously serialised Ribbon filter. */
export interface RestoreOptions extends CommonOptions {
  /** Existing filter data. */
  readonly filter: Uint32Array | readonly number[]
  readonly elements?: never
}

/** Configuration used to build or restore a Ribbon filter. */
export type Options<T> = BuildOptions<T> | RestoreOptions

/** JSON-serialisable Ribbon filter state, accepted back as `RestoreOptions`. */
export interface SerialisedRibbonFilter {
  readonly filter: number[]
  readonly fingerprintBits: number
  readonly seed: number
  readonly size: number
}
