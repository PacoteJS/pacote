import { XXHash } from './interface'
import { encode } from './utf8'

const ZERO = BigInt(0)
const PRIME_1 = BigInt('11400714785074694791')
const PRIME_2 = BigInt('14029467366897019727')
const PRIME_3 = BigInt('1609587929392839161')
const PRIME_4 = BigInt('9650029242287828579')
const PRIME_5 = BigInt('2870177450012600261')

const asUint64 = (n: bigint) => BigInt.asUintN(64, n)

function readUintNLE(bits: number, buffer: Uint8Array, offset: number): bigint {
  const max = Math.ceil(bits / 8)
  let result = ZERO
  for (let i = 0; i < max; i++) {
    result |= BigInt(buffer[offset + i]) << BigInt(8 * i)
  }
  return result
}

function shiftRightUint64(value: bigint, bits: number): bigint {
  return asUint64(value) >> BigInt(bits)
}

function rotateLeftUint64(value: bigint, bits: number): bigint {
  const n = asUint64(value)
  const b = BigInt(bits % 64)
  return (n << b) | (n >> (BigInt(64) - b))
}

function round(acc: bigint, value: bigint): bigint {
  return PRIME_1 * rotateLeftUint64(acc + PRIME_2 * value, 31)
}

function mergeRound(acc: bigint, value: bigint): bigint {
  return PRIME_4 + PRIME_1 * (acc ^ round(ZERO, value))
}

function avalanche(hash: bigint): bigint {
  const h1 = PRIME_2 * (hash ^ shiftRightUint64(hash, 33))
  const h2 = PRIME_3 * (h1 ^ shiftRightUint64(h1, 29))
  return h2 ^ shiftRightUint64(h2, 32)
}

function finalize(buffer: Uint8Array, length: number, hash: bigint): bigint {
  let index = 0
  let _hash = hash

  while (index <= length - 8) {
    const k1 = round(ZERO, readUintNLE(64, buffer, index))
    _hash = PRIME_4 + PRIME_1 * rotateLeftUint64(_hash ^ k1, 27)
    index += 8
  }

  while (index <= length - 4) {
    const k1 = PRIME_1 * readUintNLE(32, buffer, index)
    _hash = PRIME_3 + PRIME_2 * rotateLeftUint64(_hash ^ k1, 23)
    index += 4
  }

  while (index < length) {
    const k1 = PRIME_5 * BigInt(buffer[index])
    _hash = PRIME_1 * rotateLeftUint64(_hash ^ k1, 11)
    index += 1
  }

  return avalanche(_hash)
}

/**
 * Creates a XXHash64 hasher using values of type `BigInt`
 * ({@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt MDN},
 * {@link https://caniuse.com/bigint Can I Use}).
 *
 * @param seed Optional seed, defaults to `0`.
 *
 * @returns Hasher instance.
 *
 * @example
 *
 * ```typescript
 * import { xxh64BigInt } from '@pacote/xxhash'
 *
 * const hasher = xxh64BigInt(2654435761)
 *
 * hasher.update('data').digest('hex') // => '5014607643a9b4c3'
 * ```
 */
export function xxh64BigInt(seed: number | bigint = 0): XXHash<bigint> {
  let _seed: bigint
  let v1: bigint
  let v2: bigint
  let v3: bigint
  let v4: bigint
  let totalLength: number
  let bufferSize: number
  let buffer: Uint8Array

  const reset = (seed: number | bigint = _seed) => {
    _seed = asUint64(typeof seed === 'number' ? BigInt(seed) : seed)
    v1 = _seed + PRIME_1 + PRIME_2
    v2 = _seed + PRIME_2
    v3 = _seed
    v4 = _seed - PRIME_1
    totalLength = 0
    bufferSize = 0
    buffer = new Uint8Array()
  }

  reset(seed)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const digest = (encoding: 'hex') => {
    let hash: bigint

    if (totalLength >= 32) {
      hash =
        rotateLeftUint64(v1, 1) +
        rotateLeftUint64(v2, 7) +
        rotateLeftUint64(v3, 12) +
        rotateLeftUint64(v4, 18)

      hash = mergeRound(hash, v1)
      hash = mergeRound(hash, v2)
      hash = mergeRound(hash, v3)
      hash = mergeRound(hash, v4)
    } else {
      hash = v3 + PRIME_5
    }

    hash = hash + BigInt(totalLength)

    hash = finalize(buffer, bufferSize, hash)

    reset(_seed)

    return asUint64(hash).toString(16).padStart(16, '0')
  }

  const update = (data: string | ArrayBuffer) => {
    const input = typeof data === 'string' ? encode(data) : new Uint8Array(data)

    let index = 0
    const length = input.length

    totalLength += length

    if (bufferSize === 0) {
      buffer = new Uint8Array(32)
    }

    if (bufferSize + length < 32) {
      buffer.set(input.subarray(0, length), bufferSize)
      bufferSize += length
      return { digest, reset, update }
    }

    if (bufferSize > 0) {
      buffer.set(input.subarray(0, 32 - bufferSize), bufferSize)
      v1 = round(v1, readUintNLE(64, buffer, 0))
      v2 = round(v2, readUintNLE(64, buffer, 8))
      v3 = round(v3, readUintNLE(64, buffer, 16))
      v4 = round(v4, readUintNLE(64, buffer, 24))
      index += 32 - bufferSize
      bufferSize = 0
    }

    while (index <= length - 32) {
      v1 = round(v1, readUintNLE(64, input, index))
      index += 8
      v2 = round(v2, readUintNLE(64, input, index))
      index += 8
      v3 = round(v3, readUintNLE(64, input, index))
      index += 8
      v4 = round(v4, readUintNLE(64, input, index))
      index += 8
    }

    if (index < length) {
      buffer.set(input.subarray(index, length), bufferSize)
      bufferSize = length - index
    }

    return { digest, reset, update }
  }

  return { digest, reset, update }
}
