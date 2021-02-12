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

const PRIME64_1 = from('11400714785074694791')
const PRIME64_2 = from('14029467366897019727')
const PRIME64_3 = from('1609587929392839161')
const PRIME64_4 = from('9650029242287828579')
const PRIME64_5 = from('2870177450012600261')

interface XXHash {
  reset(): void
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
  return multiply(
    PRIME64_1,
    rotateLeft(add(acc, multiply(PRIME64_2, value)), 31)
  )
}

function mergeRound(acc: U64, value: U64) {
  return add(PRIME64_4, multiply(PRIME64_1, xor(round(acc, value), acc)))
}

function avalanche(h64: U64): U64 {
  const h1 = multiply(PRIME64_2, xor(h64, shiftRight(h64, 33)))
  const h2 = multiply(PRIME64_3, xor(h1, shiftRight(h1, 29)))
  return xor(h2, shiftRight(h2, 32))
}

export function xxh64(seed = 0): XXHash {
  const _seed = from(seed)
  let v1: U64
  let v2: U64
  let v3: U64
  let v4: U64
  let length: number
  let memsize: number
  let memory: Uint8Array

  const reset = () => {
    v1 = sum(_seed, PRIME64_2, PRIME64_1)
    v2 = add(_seed, PRIME64_2)
    v3 = _seed
    v4 = subtract(_seed, PRIME64_1)
    length = 0
    memsize = 0
    memory = new Uint8Array()
  }

  reset()

  const finalize = (h64: U64): U64 => {
    const _length = length & 31
    let ptr = 0

    while (ptr < _length) {
      if (ptr + 8 <= _length) {
        h64 = add(
          PRIME64_4,
          multiply(
            PRIME64_1,
            rotateLeft(xor(h64, round(ZERO, read64(memory, ptr))), 27)
          )
        )
        ptr += 8
      } else if (ptr + 4 <= _length) {
        h64 = add(
          PRIME64_3,
          multiply(
            PRIME64_2,
            rotateLeft(xor(h64, multiply(PRIME64_1, read32(memory, ptr))), 23)
          )
        )
        ptr += 4
      } else {
        h64 = multiply(
          PRIME64_1,
          rotateLeft(xor(h64, multiply(PRIME64_5, [memory[ptr], 0, 0, 0])), 11)
        )
        ptr += 1
      }
    }

    return avalanche(h64)
  }

  const digest = (encoding: 'hex') => {
    let h64: U64

    if (length >= 32) {
      h64 = sum(
        rotateLeft(v1, 1),
        rotateLeft(v2, 7),
        rotateLeft(v3, 12),
        rotateLeft(v4, 18)
      )
      h64 = mergeRound(h64, v1)
      h64 = mergeRound(h64, v2)
      h64 = mergeRound(h64, v3)
      h64 = mergeRound(h64, v4)
    } else {
      h64 = add(v3 /* seed */, PRIME64_5)
    }

    h64 = add(h64, from(length))
    h64 = finalize(h64)

    reset()

    return toString(h64, 16)
  }

  const update = (data: string | ArrayBuffer) => {
    const input =
      typeof data === 'string' ? toUTF8Array(data) : new Uint8Array(data)

    let pointer = 0

    if (input.length === 0) return { digest, reset, update }

    length = input.length

    if (memsize === 0) {
      memory = new Uint8Array(32)
    }

    if (memsize + input.length < 32) {
      memory.set(input.subarray(0, input.length), memsize)
      memsize += input.length
      return { digest, reset, update }
    }

    if (memsize > 0) {
      memory.set(input.subarray(0, 32 - memsize), memsize)
      v1 = round(v1, read64(memory, 0))
      v2 = round(v2, read64(memory, 8))
      v3 = round(v3, read64(memory, 16))
      v4 = round(v4, read64(memory, 24))
      pointer += 32 - memsize
      memsize = 0
    }

    if (pointer + 32 <= input.length) {
      do {
        v1 = round(v1, read64(memory, pointer))
        pointer += 8
        v2 = round(v2, read64(memory, pointer))
        pointer += 8
        v3 = round(v3, read64(memory, pointer))
        pointer += 8
        v4 = round(v4, read64(memory, pointer))
        pointer += 8
      } while (pointer <= input.length - 32)
    }

    if (pointer < input.length) {
      memory.set(input.subarray(pointer, input.length), 0)
      memsize = input.length - pointer
    }

    return { digest, reset, update }
  }

  return { digest, reset, update }
}
