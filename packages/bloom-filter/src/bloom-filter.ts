import { xxh64 } from '@pacote/xxhash'
import { Options } from './options'
import { range } from '@pacote/array'
import { toUint32 } from './hash'

export class BloomFilter<T extends { toString(): string }> {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: Uint32Array
  private readonly hash: (index: number, element: string) => number

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
      const hashedValue = this.hash(i, element.toString()) % this.size
      const position = Math.floor(hashedValue / 32)
      this.filter[position] |= 1 << (hashedValue - position * 32)
    })
  }

  has(element: T): boolean {
    return range(0, this.hashes).every((i) => {
      const hashedValue = this.hash(i, element.toString()) % this.size
      const position = Math.floor(hashedValue / 32)
      return this.filter[position] & (1 << (hashedValue - position * 32))
    })
  }

  toJSON(): SerialisedBloomFilter {
    return {
      filter: Array.from(this.filter),
      hashes: this.hashes,
      seed: this.seed,
      size: this.size,
    }
  }
}

type SerialisedBloomFilter = {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: number[]
}
