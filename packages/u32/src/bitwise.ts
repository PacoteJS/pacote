import type { U32 } from './u32'

/**
 * Returns the bitwise AND of two `U32` values.
 * @param a - First operand.
 * @param b - Second operand.
 * @returns The bitwise AND result.
 */
export function and(a: U32, b: U32): U32 {
  return [a[0] & b[0], a[1] & b[1]]
}

/**
 * Returns the bitwise OR of two `U32` values.
 * @param a - First operand.
 * @param b - Second operand.
 * @returns The bitwise OR result.
 */
export function or(a: U32, b: U32): U32 {
  return [a[0] | b[0], a[1] | b[1]]
}

/**
 * Returns the bitwise XOR of two `U32` values.
 * @param a - First operand.
 * @param b - Second operand.
 * @returns The bitwise XOR result.
 */
export function xor(a: U32, b: U32): U32 {
  return [a[0] ^ b[0], a[1] ^ b[1]]
}

/**
 * Returns the two's-complement negation of a `U32` value.
 * @param value - Value to negate.
 * @returns The negated value.
 */
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

/**
 * Shifts a `U32` value left, discarding excess bits unless `overflow` is true.
 * @param value - Value to shift.
 * @param bits - Number of bit positions to shift.
 * @param overflow - Whether to preserve overflow in the high block.
 * @returns The shifted value.
 */
export function shiftLeft(value: U32, bits: number, overflow = false): U32 {
  const [v0, v1]: U32 = _shiftLeft(value, bits)
  return overflow ? [v0 & 0xffff, v1] : [v0 & 0xffff, v1 & 0xffff]
}

function _shiftRight(value: U32, bits: number): U32 {
  const _bits = bits % 32

  if (_bits >= 16) {
    return [value[1] >> (_bits - 16), 0]
  }

  return [(value[0] >> _bits) | (value[1] << (16 - _bits)), value[1] >> _bits]
}

/**
 * Shifts a `U32` value right, filling high bits with zero.
 * @param value - Value to shift.
 * @param bits - Number of bit positions to shift.
 * @returns The shifted value.
 */
export function shiftRight(value: U32, bits: number): U32 {
  const [v0, v1]: U32 = _shiftRight(value, bits)
  return [v0 & 0xffff, v1 & 0xffff]
}

/**
 * Rotates a `U32` value left, wrapping shifted bits around to the right.
 * @param value - Value to rotate.
 * @param bits - Number of bit positions to rotate.
 * @returns The rotated value.
 */
export function rotateLeft(value: U32, bits: number): U32 {
  let v = (value[1] << 16) | value[0]
  v = (v << bits) | (v >>> (32 - bits))
  return [v & 0xffff, v >>> 16]
}

/**
 * Rotates a `U32` value right, wrapping shifted bits around to the left.
 * @param value - Value to rotate.
 * @param bits - Number of bit positions to rotate.
 * @returns The rotated value.
 */
export function rotateRight(value: U32, bits: number): U32 {
  let v = (value[1] << 16) | value[0]
  v = (v >>> bits) | (v << (32 - bits))
  return [v & 0xffff, v >>> 16]
}
