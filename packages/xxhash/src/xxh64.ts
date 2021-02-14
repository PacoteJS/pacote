import {
  add,
  from,
  multiply,
  rotateLeft,
  shiftRight,
  subtract,
  toString,
  U64,
  xor,
  ZERO,
} from '@pacote/u64'
import { toUTF8Array } from './utf8'

const PRIME_1 = from('11400714785074694791')
const PRIME_2 = from('14029467366897019727')
const PRIME_3 = from('1609587929392839161')
const PRIME_4 = from('9650029242287828579')
const PRIME_5 = from('2870177450012600261')

interface XXHash {
  reset(seed: number | U64): void
  digest(encoding: 'hex'): string
  update(input: string | ArrayBuffer): XXHash
}

function read64(memory: Uint8Array, pointer: number): U64 {
  return [
    (memory[pointer + 1] << 8) | memory[pointer + 0],
    (memory[pointer + 3] << 8) | memory[pointer + 2],
    (memory[pointer + 5] << 8) | memory[pointer + 4],
    (memory[pointer + 7] << 8) | memory[pointer + 6],
  ]
}

function read32(memory: Uint8Array, pointer: number): U64 {
  return [
    (memory[pointer + 1] << 8) | memory[pointer + 0],
    (memory[pointer + 3] << 8) | memory[pointer + 2],
    0,
    0,
  ]
}

function sum(...values: U64[]): U64 {
  return values.reduce(add, ZERO)
}

function round(acc: U64, value: U64): U64 {
  return multiply(PRIME_1, rotateLeft(add(acc, multiply(PRIME_2, value)), 31))
}

function mergeRound(acc: U64, value: U64) {
  return add(PRIME_4, multiply(PRIME_1, xor(acc, round(ZERO, value))))
}

function avalanche(hash: U64): U64 {
  const h1 = multiply(PRIME_2, xor(hash, shiftRight(hash, 33)))
  const h2 = multiply(PRIME_3, xor(h1, shiftRight(h1, 29)))
  return xor(h2, shiftRight(h2, 32))
}

function finalize(buffer: Uint8Array, length: number, hash: U64): U64 {
  let pointer = 0
  let _hash = hash

  while (pointer <= length - 8) {
    const k1 = round(ZERO, read64(buffer, pointer))
    _hash = add(PRIME_4, multiply(PRIME_1, rotateLeft(xor(_hash, k1), 27)))
    pointer += 8
  }

  while (pointer <= length - 4) {
    const k1 = multiply(PRIME_1, read32(buffer, pointer))
    _hash = add(PRIME_3, multiply(PRIME_2, rotateLeft(xor(_hash, k1), 23)))
    pointer += 4
  }

  while (pointer < length) {
    const k1 = multiply(PRIME_5, [buffer[pointer], 0, 0, 0])
    _hash = multiply(PRIME_1, rotateLeft(xor(_hash, k1), 11))
    pointer += 1
  }

  return avalanche(_hash)
}

export function xxh64(seed: number | U64 = 0): XXHash {
  let _seed: U64
  let v1: U64
  let v2: U64
  let v3: U64
  let v4: U64
  let totalLength: number
  let bufferSize: number
  let buffer: Uint8Array

  const reset = (seed: number | U64 = 0) => {
    _seed = typeof seed === 'number' ? from(seed) : seed
    v1 = sum(_seed, PRIME_1, PRIME_2)
    v2 = add(_seed, PRIME_2)
    v3 = _seed
    v4 = subtract(_seed, PRIME_1)
    totalLength = 0
    bufferSize = 0
    buffer = new Uint8Array()
  }

  reset(seed)

  const digest = (encoding: 'hex') => {
    let hash: U64

    if (totalLength >= 32) {
      hash = sum(
        rotateLeft(v1, 1),
        rotateLeft(v2, 7),
        rotateLeft(v3, 12),
        rotateLeft(v4, 18)
      )

      hash = mergeRound(hash, v1)
      hash = mergeRound(hash, v2)
      hash = mergeRound(hash, v3)
      hash = mergeRound(hash, v4)
    } else {
      hash = add(v3, PRIME_5)
    }

    hash = add(hash, from(totalLength))
    hash = finalize(buffer, bufferSize, hash)

    reset(_seed)

    return toString(hash, 16)
  }

  const update = (data: string | ArrayBuffer) => {
    const input =
      typeof data === 'string' ? toUTF8Array(data) : new Uint8Array(data)

    let pointer = 0
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
      v1 = round(v1, read64(buffer, 0))
      v2 = round(v2, read64(buffer, 8))
      v3 = round(v3, read64(buffer, 16))
      v4 = round(v4, read64(buffer, 24))
      pointer += 32 - bufferSize
      bufferSize = 0
    }

    if (pointer <= length - 32) {
      do {
        v1 = round(v1, read64(input, pointer))
        pointer += 8
        v2 = round(v2, read64(input, pointer))
        pointer += 8
        v3 = round(v3, read64(input, pointer))
        pointer += 8
        v4 = round(v4, read64(input, pointer))
        pointer += 8
      } while (pointer <= length - 32)
    }

    if (pointer < length) {
      buffer.set(input.subarray(pointer, length), bufferSize)
      bufferSize = length - pointer
    }

    return { digest, reset, update }
  }

  return { digest, reset, update }
}
