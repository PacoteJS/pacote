import { toUint32 } from './hash'
import { Options } from './options'
import { xxh64 } from '@pacote/xxhash'
import { range } from '@pacote/array'

export class CountingBloomFilter<T extends { toString(): string }> {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: Uint32Array
  private hash: (i: number, element: string) => number

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
    this.filter = options.filter ?? new Uint32Array(this.size)

    const h1 = xxh64(this.seed + 1)
    const h2 = xxh64(this.seed + 2)

    const defaultHash = (i: number, data: string): number => {
      const d1 = toUint32(h1.update(data).digest('hex'))
      const d2 = toUint32(h2.update(data).digest('hex'))
      return d1 + i * d2 + i ** 3
    }

    this.hash = options.hash ?? defaultHash
  }

  add(element: T): void {
    range(0, this.hashes).forEach((i) => {
      const position = this.hashPosition(i, element)
      this.filter[position] += 1
    })
  }

  remove(element: T): void {
    range(0, this.hashes).forEach((i) => {
      const position = this.hashPosition(i, element)
      if (this.filter[position] > 0) {
        this.filter[position] -= 1
      }
    })
  }

  has(element: T): number {
    return Math.min(
      ...range(0, this.hashes).map((i) => {
        const position = this.hashPosition(i, element)
        return this.filter[position]
      })
    )
  }

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

type SerialisedCountingBloomFilter = {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: number[]
}
