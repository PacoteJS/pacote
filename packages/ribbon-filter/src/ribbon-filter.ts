import { defaultHash } from './hash'
import type { HashFunction, Options, SerialisedRibbonFilter } from './options'

const MAX_WIDTH = 32

const mask = (bits: number): number =>
  bits === 32 ? 0xffffffff : (1 << bits) - 1

/**
 * A space-efficient, static probabilistic set for values with a stable
 * `toString()`.
 *
 * A Ribbon filter is built once from its complete set of elements and cannot
 * be changed afterwards. Membership checks can produce false positives, at a
 * rate of 2^-`fingerprintBits`, but never false negatives. It stores about
 * 1.09 × `fingerprintBits` bits per element, roughly 25% less than a Bloom
 * filter with the same false positive rate.
 *
 * This is a Standard Ribbon filter (Dillinger and Walzer, 2021) with a ribbon
 * width of at most 32 bits. The filter uses seeded XXH64 hashing by default.
 * This hash is non-cryptographic and should not be used for
 * security-sensitive purposes.
 *
 * @typeParam T - Values represented by the filter.
 * @example
 * ```typescript
 * import { optimal, RibbonFilter } from '@pacote/ribbon-filter'
 *
 * const filter = new RibbonFilter({
 *   ...optimal(2, 0.01),
 *   elements: ['foo', 'bar'],
 * })
 * filter.has('foo') // => true
 * filter.has('bar') // => true
 * filter.has('baz') // => false
 * ```
 */
export class RibbonFilter<T extends { toString(): string }> {
  /** Number of rows in the solution table, after any growth during the build. */
  readonly size: number
  /** Bits per fingerprint; the false positive rate is 2^-fingerprintBits. */
  readonly fingerprintBits: number
  /** Seed for the default hash function. */
  readonly seed: number
  /** Solution table, one `fingerprintBits`-wide row after another. */
  readonly filter: Uint32Array
  private readonly hash: HashFunction

  /**
   * Builds a filter from its elements, or restores a serialised filter.
   *
   * When the elements cannot be stored in a table of the requested size, the
   * table grows by about 3% and the build is retried.
   *
   * @param options - Filter size, fingerprint bits, and either the elements
   * to build from or the filter data to restore.
   * @returns A new Ribbon filter.
   * @throws Error if `size` is less than 1, if `fingerprintBits` is not
   * between 1 and 32, if both `elements` and `filter` are provided, or if the
   * elements cannot be stored after repeated attempts.
   */
  constructor(options: Options<T>) {
    if (options.size < 1) {
      throw Error('size must be greater than 0')
    }

    if (options.fingerprintBits < 1 || options.fingerprintBits > 32) {
      throw Error('fingerprint bits must be between 1 and 32')
    }

    if (options.elements && options.filter) {
      throw Error('a filter cannot be built from elements and filter data')
    }

    this.fingerprintBits = options.fingerprintBits
    this.seed = options.seed ?? 0x00c0ffee
    this.hash = options.hash ?? defaultHash(this.seed)

    if (options.filter) {
      this.size = options.size
      this.filter = Uint32Array.from(options.filter)
      return
    }

    // Hashes do not depend on the size, so retries reuse them.
    const hashes = Array.from(options.elements ?? [], (e) => this.hashes(e))
    const equations = (size: number) =>
      hashes.map((h) => equation(h, size, this.fingerprintBits))

    let size = options.size
    let rows = solve(equations(size), size)
    for (let attempt = 1; !rows; attempt++) {
      if (attempt === MAX_ATTEMPTS) throw Error('unable to build the filter')
      size = grow(size)
      rows = solve(equations(size), size)
    }
    this.size = size
    this.filter = pack(rows, this.fingerprintBits)
  }

  /**
   * Checks whether an element may be present in the filter.
   * @param element - Value to look up.
   * @returns `false` guarantees the element is absent; `true` means it may be
   * present and can be a false positive.
   */
  has(element: T): boolean {
    const { start, coefficients, fingerprint } = equation(
      this.hashes(element),
      this.size,
      this.fingerprintBits,
    )
    let result = 0
    for (let c = coefficients, i = start; c !== 0; c >>>= 1, i++) {
      if (c & 1) result ^= row(this.filter, i, this.fingerprintBits)
    }
    return result >>> 0 === fingerprint
  }

  /**
   * Returns the filter state in a JSON-serialisable form.
   * @returns Filter size, fingerprint bits, seed, and table data.
   */
  toJSON(): SerialisedRibbonFilter {
    return {
      filter: Array.from(this.filter),
      fingerprintBits: this.fingerprintBits,
      seed: this.seed,
      size: this.size,
    }
  }

  private hashes(element: T): Hashes {
    const data = element.toString()
    return [this.hash(0, data), this.hash(1, data), this.hash(2, data)]
  }
}

/** Start, coefficients and fingerprint hashes for one element. */
type Hashes = [number, number, number]

function equation(
  [start, coefficients, fingerprint]: Hashes,
  size: number,
  fingerprintBits: number,
): Equation {
  const width = Math.min(MAX_WIDTH, size)
  return {
    start: (start >>> 0) % (size - width + 1),
    coefficients: ((coefficients & mask(width)) | 1) >>> 0,
    fingerprint: (fingerprint & mask(fingerprintBits)) >>> 0,
  }
}

/** Rows packed at `bits` bits each, so the table costs size × bits. */
function pack(rows: Uint32Array, bits: number): Uint32Array {
  const words = new Uint32Array(Math.ceil((rows.length * bits) / 32))
  for (let i = 0; i < rows.length; i++) {
    const offset = i * bits
    const word = Math.floor(offset / 32)
    const shift = offset % 32
    words[word] |= rows[i] << shift
    if (shift + bits > 32) words[word + 1] |= rows[i] >>> (32 - shift)
  }
  return words
}

function row(words: Uint32Array, i: number, bits: number): number {
  const offset = i * bits
  const word = Math.floor(offset / 32)
  const shift = offset % 32
  let value = words[word] >>> shift
  if (shift + bits > 32) value |= words[word + 1] << (32 - shift)
  return (value & mask(bits)) >>> 0
}

interface Equation {
  readonly start: number
  readonly coefficients: number
  readonly fingerprint: number
}

// ponytail: provisional, tuned by measuring build success on real bucket sizes.
const MAX_ATTEMPTS = 10

/** Larger tables move every start position, so a retry solves a new system. */
function grow(size: number): number {
  return size < MAX_WIDTH
    ? size + 1
    : Math.ceil((size * (MAX_WIDTH + 1)) / MAX_WIDTH)
}

/**
 * Standard Ribbon: on-the-fly Gaussian elimination into a banded matrix,
 * then back substitution. Returns undefined for an inconsistent system.
 */
function solve(equations: Equation[], size: number): Uint32Array | undefined {
  const coefficients = new Uint32Array(size)
  const results = new Uint32Array(size)

  for (const equation of equations) {
    let i = equation.start
    let c = equation.coefficients
    let r = equation.fingerprint
    for (;;) {
      if (coefficients[i] === 0) {
        coefficients[i] = c
        results[i] = r
        break
      }
      c = (c ^ coefficients[i]) >>> 0
      r = (r ^ results[i]) >>> 0
      if (c === 0) {
        if (r === 0) break // ponytail: duplicate element, redundant equation
        return undefined
      }
      const shift = 31 - Math.clz32(c & -c)
      c >>>= shift
      i += shift
    }
  }

  const solution = new Uint32Array(size)
  for (let i = size - 1; i >= 0; i--) {
    let value = results[i]
    for (let c = coefficients[i] >>> 1, j = i + 1; c !== 0; c >>>= 1, j++) {
      if (c & 1) value ^= solution[j]
    }
    solution[i] = value
  }
  return solution
}
