import { clamp, clampBlocks, overflow, U32 } from './u32'

function softClampBlocks([v0, v1]: U32): U32 {
  return [clamp(v0), v1]
}

function normalise(bits: number): number {
  return bits % 32
}

export function and(a: U32, b: U32): U32 {
  return [a[0] & b[0], a[1] & b[1]]
}

export function or(a: U32, b: U32): U32 {
  return [a[0] | b[0], a[1] | b[1]]
}

export function xor(a: U32, b: U32): U32 {
  return [a[0] ^ b[0], a[1] ^ b[1]]
}

function _shiftLeft(value: U32, bits: number): U32 {
  const n = bits
  if (n > 16) {
    return [0, value[0] << (n - 16)]
  } else if (n === 16) {
    return [0, value[0]]
  } else {
    return [value[0] << n, (value[1] << n) | (value[0] >> (16 - n))]
  }
}

export function shiftLeft(value: U32, bits: number, overflow = false): U32 {
  return overflow
    ? softClampBlocks(_shiftLeft(value, bits))
    : clampBlocks(_shiftLeft(value, bits))
}

function _shiftRight(value: U32, bits: number): U32 {
  const _bits = normalise(bits)

  if (_bits >= 16) {
    const n = _bits - 16
    return [value[1] >> n, 0]
  } else {
    const n = _bits
    return [(value[0] >> n) | (value[1] << (16 - n)), value[1] >> n]
  }
}

export function shiftRight(value: U32, bits: number): U32 {
  return clampBlocks(_shiftRight(value, bits))
}

export function rotateLeft(u32: U32, bits: number): U32 {
  let v = (u32[1] << 16) | u32[0]
  v = (v << bits) | (v >>> (32 - bits))
  return [clamp(v), overflow(v)]
}

export function rotateRight(u32: U32, bits: number): U32 {
  let v = (u32[1] << 16) | u32[0]
  v = (v >>> bits) | (v << (32 - bits))
  return [clamp(v), overflow(v)]
}
