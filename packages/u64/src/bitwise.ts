import { clamp, clampBlocks, overflow, U64 } from './u64'

function softClampBlocks([v0, v1, v2, v3]: U64): U64 {
  return [clamp(v0), clamp(v1), clamp(v2), v3]
}

export function xor(a: U64, b: U64): U64 {
  return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]]
}

function _shiftLeft(value: U64, bits: number): U64 {
  const _bits = bits % 64

  if (_bits >= 48) {
    return [0, 0, 0, value[0] << (_bits - 48)]
  } else if (_bits >= 32) {
    return [
      0,
      0,
      value[0] << (_bits - 32),
      (value[1] << (_bits - 32)) | (value[0] >> (_bits - 16)),
    ]
  } else if (_bits >= 16) {
    return [
      0,
      value[0] << (_bits - 16),
      (value[1] << (_bits - 16)) | (value[0] >> _bits),
      (value[2] << (_bits - 16)) | (value[1] >> _bits),
    ]
  } else {
    return [
      value[0] << _bits,
      (value[1] << _bits) | (value[0] >> (16 - _bits)),
      (value[2] << _bits) | (value[1] >> (16 - _bits)),
      (value[3] << _bits) | (value[2] >> (16 - _bits)),
    ]
  }
}

export function shiftLeft(value: U64, bits: number, overflow = false): U64 {
  return overflow
    ? softClampBlocks(_shiftLeft(value, bits))
    : clampBlocks(_shiftLeft(value, bits))
}

function _shiftRight(value: U64, bits: number): U64 {
  const _bits = bits % 64

  if (_bits >= 48) {
    return [value[3] >> (_bits - 48), 0, 0, 0]
  } else if (_bits >= 32) {
    return [
      (value[2] >> (_bits - 32)) | (value[3] << (_bits - 16)),
      value[3] >> (_bits - 32),
      0,
      0,
    ]
  } else if (_bits >= 16) {
    return [
      (value[1] >> (_bits - 16)) | (value[2] << _bits),
      (value[2] >> (_bits - 16)) | (value[3] << _bits),
      value[3] >> (_bits - 16),
      0,
    ]
  } else {
    return [
      (value[0] >> _bits) | (value[1] << (16 - _bits)),
      (value[1] >> _bits) | (value[2] << (16 - _bits)),
      (value[2] >> _bits) | (value[3] << (16 - _bits)),
      value[3] >> _bits,
    ]
  }
}

export function shiftRight(value: U64, bits: number): U64 {
  return clampBlocks(_shiftRight(value, bits))
}

export function rotateLeft(value: U64, bits: number): U64 {
  let _bits = bits % 64
  if (_bits === 0) return value

  const _r: U64 =
    _bits >= 32 ? [value[2], value[3], value[0], value[1]] : [...value]

  if (_bits >= 32) {
    _bits -= 32
  }

  if (_bits === 0) return _r

  const high = (_r[3] << 16) | _r[2]
  const low = (_r[1] << 16) | _r[0]

  const _high = (high << _bits) | (low >>> (32 - _bits))
  const _low = (low << _bits) | (high >>> (32 - _bits))

  return [clamp(_low), overflow(_low), clamp(high), overflow(_high)]
}
