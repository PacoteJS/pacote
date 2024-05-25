import { type U32, clamp, clampBlocks, overflow } from './u32'

function softClampBlocks([v0, v1]: U32): U32 {
  return [clamp(v0), v1]
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

export function negate(value: U32): U32 {
  const r0 = clamp(~value[0]) + 1
  const r1 = clamp(~value[1]) + overflow(r0)

  return clampBlocks([r0, r1])
}

function _shiftLeft(value: U32, bits: number): U32 {
  if (bits > 16) {
    return [0, value[0] << (bits - 16)]
  }

  if (bits === 16) {
    return [0, value[0]]
  }

  return [value[0] << bits, (value[1] << bits) | (value[0] >> (16 - bits))]
}

export function shiftLeft(value: U32, bits: number, overflow = false): U32 {
  return overflow
    ? softClampBlocks(_shiftLeft(value, bits))
    : clampBlocks(_shiftLeft(value, bits))
}

function _shiftRight(value: U32, bits: number): U32 {
  const _bits = bits % 32

  if (_bits >= 16) {
    return [value[1] >> (_bits - 16), 0]
  }

  return [(value[0] >> _bits) | (value[1] << (16 - _bits)), value[1] >> _bits]
}

export function shiftRight(value: U32, bits: number): U32 {
  return clampBlocks(_shiftRight(value, bits))
}

export function rotateLeft(value: U32, bits: number): U32 {
  let v = (value[1] << 16) | value[0]
  v = (v << bits) | (v >>> (32 - bits))
  return [clamp(v), overflow(v)]
}

export function rotateRight(value: U32, bits: number): U32 {
  let v = (value[1] << 16) | value[0]
  v = (v >>> bits) | (v << (32 - bits))
  return [clamp(v), overflow(v)]
}
