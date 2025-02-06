import type { U32 } from './u32'

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
  const r0 = (~value[0] & 0xffff) + 1
  const r1 = (~value[1] & 0xffff) + (r0 >>> 16)

  return [r0 & 0xffff, r1 & 0xffff]
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
  const [v0, v1]: U32 = _shiftLeft(value, bits)
  return overflow
    ? [v0 & 0xffff, v1]
    : [v0 & 0xffff, v1 & 0xffff]
}

function _shiftRight(value: U32, bits: number): U32 {
  const _bits = bits % 32

  if (_bits >= 16) {
    return [value[1] >> (_bits - 16), 0]
  }

  return [(value[0] >> _bits) | (value[1] << (16 - _bits)), value[1] >> _bits]
}

export function shiftRight(value: U32, bits: number): U32 {
  const [v0, v1]: U32 = _shiftRight(value, bits)
  return [v0 & 0xffff, v1 & 0xffff]
}

export function rotateLeft(value: U32, bits: number): U32 {
  let v = (value[1] << 16) | value[0]
  v = (v << bits) | (v >>> (32 - bits))
  return [v & 0xffff, v >>> 16]
}

export function rotateRight(value: U32, bits: number): U32 {
  let v = (value[1] << 16) | value[0]
  v = (v >>> bits) | (v << (32 - bits))
  return [v & 0xffff, v >>> 16]
}
