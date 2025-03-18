import { type U64, clamp, clampBlocks, overflow } from './u64'

function softClampBlocks([v0, v1, v2, v3]: U64): U64 {
  return [clamp(v0), clamp(v1), clamp(v2), v3]
}

function normalise(bits: number): number {
  return bits % 64
}

/**
 * Performs a bitwise AND operation on two `U64` values. Equivalent to the
 * numeric `&` operator.
 *
 * @param a - First operand.
 * @param b - Second operand.
 *
 * @returns The result of the bitwise AND operation.
 *
 * @category Bitwise
 */
export function and(a: U64, b: U64): U64 {
  return [a[0] & b[0], a[1] & b[1], a[2] & b[2], a[3] & b[3]]
}

/**
 * Performs a bitwise OR operation on two `U64` values. Equivalent to the
 * numeric `|` operator.
 *
 * @param a - First operand.
 * @param b - Second operand.
 *
 * @returns The result of the bitwise OR operation.
 *
 * @category Bitwise
 */
export function or(a: U64, b: U64): U64 {
  return [a[0] | b[0], a[1] | b[1], a[2] | b[2], a[3] | b[3]]
}

/**
 * Performs a bitwise XOR operation on two `U64` values. Equivalent to the
 * numeric `^` operator.
 *
 * @param a - First operand.
 * @param b - Second operand.
 *
 * @returns The result of the bitwise XOR operation.
 *
 * @category Bitwise
 */
export function xor(a: U64, b: U64): U64 {
  return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]]
}

function _shiftLeft(value: U64, bits: number): U64 {
  const _bits = normalise(bits)

  if (_bits >= 48) {
    const n = _bits - 48
    return [0, 0, 0, value[0] << n]
  }

  if (_bits >= 32) {
    const n = _bits - 32
    return [0, 0, value[0] << n, (value[1] << n) | (value[0] >> (16 - n))]
  }

  if (_bits >= 16) {
    const n = _bits - 16
    return [
      0,
      value[0] << n,
      (value[1] << n) | (value[0] >> (16 - n)),
      (value[2] << n) | (value[1] >> (16 - n)),
    ]
  }

  const n = _bits
  return [
    value[0] << n,
    (value[1] << n) | (value[0] >> (16 - n)),
    (value[2] << n) | (value[1] >> (16 - n)),
    (value[3] << n) | (value[2] >> (16 - n)),
  ]
}

/**
 * Shifts the bits of a `U64` value to the left. Equivalent to the numeric `<<`
 * operator.
 *
 * @param value - Value to shift.
 * @param bits - Number of bits to shift by.
 * @param overflow - Whether to allow overflow in the most significant block.
 *
 * @returns The shifted value.
 *
 * @category Bitwise
 */
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
  }

  if (_bits >= 32) {
    const n = _bits - 32
    return [(value[2] >> n) | (value[3] << (16 - n)), value[3] >> n, 0, 0]
  }

  if (_bits >= 16) {
    const n = _bits - 16
    return [
      (value[1] >> (_bits - 16)) | (value[2] << (16 - n)),
      (value[2] >> (_bits - 16)) | (value[3] << (16 - n)),
      value[3] >> (_bits - 16),
      0,
    ]
  }

  const n = _bits
  return [
    (value[0] >> n) | (value[1] << (16 - n)),
    (value[1] >> n) | (value[2] << (16 - n)),
    (value[2] >> n) | (value[3] << (16 - n)),
    value[3] >> n,
  ]
}

/**
 * Shifts the bits of a `U64` value to the right. Equivalent to the numeric `>>`
 * operator.
 *
 * @param value - Value to shift.
 * @param bits - Number of bits to shift by.
 *
 * @returns The shifted value.
 *
 * @category Bitwise
 */
export function shiftRight(value: U64, bits: number): U64 {
  return clampBlocks(_shiftRight(value, bits))
}

/**
 * Rotates the bits of a `U64` value to the left.
 *
 * @param value - Value to rotate.
 * @param bits - Number of bits to rotate by.
 *
 * @returns The rotated value.
 *
 * @category Bitwise
 */
export function rotateLeft(value: U64, bits: number): U64 {
  const _bits = bits % 64

  const bitsToShift = _bits >= 32 ? _bits - 32 : _bits

  const _value: U64 = _bits >= 32 ? [value[2], value[3], value[0], value[1]] : value

  if (bitsToShift === 0) return _value

  const h = (_value[3] << 16) | _value[2]
  const l = (_value[1] << 16) | _value[0]

  const high = (h << bitsToShift) | (l >>> (32 - bitsToShift))
  const low = (l << bitsToShift) | (h >>> (32 - bitsToShift))

  return [clamp(low), overflow(low), clamp(high), overflow(high)]
}

/**
 * Rotates the bits of a `U64` value to the right.
 *
 * @param value - Value to rotate.
 * @param bits - Number of bits to rotate by.
 *
 * @returns The rotated value.
 *
 * @category Bitwise
 */
export function rotateRight(value: U64, bits: number): U64 {
  const _bits = bits % 64

  const bitsToShift = _bits >= 32 ? _bits - 32 : _bits
  const _value: U64 = _bits >= 32 ? [value[2], value[3], value[0], value[1]] : value

  if (bitsToShift === 0) return _value

  const h = (_value[3] << 16) | _value[2]
  const l = (_value[1] << 16) | _value[0]

  const high = (h >>> bitsToShift) | (l << (32 - bitsToShift))
  const low = (l >>> bitsToShift) | (h << (32 - bitsToShift))

  return [clamp(low), overflow(low), clamp(high), overflow(high)]
}
