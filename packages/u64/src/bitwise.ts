import { clamp, clampBlocks, overflow, U64 } from './u64'

function softClampBlocks([v0, v1, v2, v3]: U64): U64 {
  return [clamp(v0), clamp(v1), clamp(v2), v3]
}

function normalise(bits: number): number {
  return bits % 64
}

export function and(a: U64, b: U64): U64 {
  return [a[0] & b[0], a[1] & b[1], a[2] & b[2], a[3] & b[3]]
}

export function or(a: U64, b: U64): U64 {
  return [a[0] | b[0], a[1] | b[1], a[2] | b[2], a[3] | b[3]]
}

export function xor(a: U64, b: U64): U64 {
  return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]]
}

function _shiftLeft(value: U64, bits: number): U64 {
  const _bits = normalise(bits)

  if (_bits >= 48) {
    const n = _bits - 48
    return [0, 0, 0, value[0] << n]
  } else if (_bits >= 32) {
    const n = _bits - 32
    return [0, 0, value[0] << n, (value[1] << n) | (value[0] >> (16 - n))]
  } else if (_bits >= 16) {
    const n = _bits - 16
    return [
      0,
      value[0] << n,
      (value[1] << n) | (value[0] >> (16 - n)),
      (value[2] << n) | (value[1] >> (16 - n)),
    ]
  } else {
    const n = _bits
    return [
      value[0] << n,
      (value[1] << n) | (value[0] >> (16 - n)),
      (value[2] << n) | (value[1] >> (16 - n)),
      (value[3] << n) | (value[2] >> (16 - n)),
    ]
  }
}

export function shiftLeft(value: U64, bits: number, overflow = false): U64 {
  return overflow
    ? softClampBlocks(_shiftLeft(value, bits))
    : clampBlocks(_shiftLeft(value, bits))
}

function _shiftRight(value: U64, bits: number): U64 {
  const _bits = normalise(bits)

  if (_bits >= 48) {
    const n = _bits - 48
    return [value[3] >> n, 0, 0, 0]
  } else if (_bits >= 32) {
    const n = _bits - 32
    return [(value[2] >> n) | (value[3] << (16 - n)), value[3] >> n, 0, 0]
  } else if (_bits >= 16) {
    const n = _bits - 16
    return [
      (value[1] >> (_bits - 16)) | (value[2] << (16 - n)),
      (value[2] >> (_bits - 16)) | (value[3] << (16 - n)),
      value[3] >> (_bits - 16),
      0,
    ]
  } else {
    const n = _bits
    return [
      (value[0] >> n) | (value[1] << (16 - n)),
      (value[1] >> n) | (value[2] << (16 - n)),
      (value[2] >> n) | (value[3] << (16 - n)),
      value[3] >> n,
    ]
  }
}

export function shiftRight(value: U64, bits: number): U64 {
  return clampBlocks(_shiftRight(value, bits))
}

export function rotateLeft(u64: U64, bits: number): U64 {
  const _bits = bits % 64

  const bitsToShift = _bits >= 32 ? _bits - 32 : _bits

  const _u64: U64 = _bits >= 32 ? [u64[2], u64[3], u64[0], u64[1]] : u64

  if (bitsToShift === 0) return _u64

  const h = (_u64[3] << 16) | _u64[2]
  const l = (_u64[1] << 16) | _u64[0]

  const high = (h << bitsToShift) | (l >>> (32 - bitsToShift))
  const low = (l << bitsToShift) | (h >>> (32 - bitsToShift))

  return [clamp(low), overflow(low), clamp(high), overflow(high)]
}

export function rotateRight(u64: U64, bits: number): U64 {
  const _bits = bits % 64

  const bitsToShift = _bits >= 32 ? _bits - 32 : _bits
  const _u64: U64 = _bits >= 32 ? [u64[2], u64[3], u64[0], u64[1]] : u64

  if (bitsToShift === 0) return _u64

  const h = (_u64[3] << 16) | _u64[2]
  const l = (_u64[1] << 16) | _u64[0]

  const high = (h >>> bitsToShift) | (l << (32 - bitsToShift))
  const low = (l >>> bitsToShift) | (h << (32 - bitsToShift))

  return [clamp(low), overflow(low), clamp(high), overflow(high)]
}
