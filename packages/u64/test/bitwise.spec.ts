import { array, assert, nat, property } from 'fast-check'
import {
  and,
  from,
  or,
  rotateLeft,
  rotateRight,
  shiftLeft,
  shiftRight,
  xor,
  ZERO,
} from '../src'

const arb64Bits = () => array(nat(1), { maxLength: 64 }).map((a) => a.join(''))

describe('and', () => {
  it('consistent with numeric bitwise and', () => {
    assert(
      property(nat(), nat(), (a, b) => {
        expect(and(from(a), from(b))).toEqual(from(a & b))
      })
    )
  })
})

describe('or', () => {
  it('consistent with numeric bitwise or', () => {
    assert(
      property(nat(), nat(), (a, b) => {
        expect(or(from(a), from(b))).toEqual(from(a | b))
      })
    )
  })
})

describe('xor', () => {
  it('consistent with numeric bitwise xor', () => {
    assert(
      property(nat(), nat(), (a, b) => {
        expect(xor(from(a), from(b))).toEqual(from(a ^ b))
      })
    )
  })
})

describe('shift left', () => {
  it.each([
    [from(1), 0, from(1)],
    [from(0), 1, ZERO],
    [from(1), 2, from(4)],
    [from(1), 16, from(65536)],
    [from(1), 32, from('4294967296')],
    [from(1), 31, from('2147483648')],
    [from(9), 28, from('2415919104')],
    [from('4294967296'), 1, from('8589934592')],
    [from('2147483648'), 1, from('4294967296')],
    [from('2415919104'), 1, from('4831838208')],
  ])('shifts %d left by %d bits', (value, bits, expected) => {
    expect(shiftLeft(value, bits)).toEqual(expected)
  })
})

describe('shift right', () => {
  it.each([
    [from(1), 0, 1],
    [ZERO, 1, 0],
    [from(4), 2, 1],
    [from(65536), 16, 1],
    [from(1), 32, 0],
    [from('2147483648'), 31, 1],
    [from('2415919104'), 28, 9],
  ])(`shifts %s right by %d bits`, (value, bits, expected) => {
    expect(shiftRight(value, bits)).toEqual(from(expected))
  })
})

describe('rotate left', () => {
  it.each([
    ['1', 0, '1'],
    ['0', 1, '0'],
    ['1', 2, '4'],
    ['1', 16, '65536'],
    ['1', 32, '4294967296'],
    ['1', 48, '281474976710656'],
    ['1', 64, '1'],
  ])('rotates %s left by %d bits', (value, bits, expected) => {
    expect(rotateLeft(from(value), bits)).toEqual(from(expected))
  })
})

describe('rotate right', () => {
  it.each([
    ['1', 0, '1'],
    ['0', 1, '0'],
    ['4', 2, '1'],
    ['65536', 16, '1'],
    ['4294967296', 32, '1'],
    ['281474976710656', 48, '1'],
    ['1', 64, '1'],
  ])('rotates %s right by %d bits', (value, bits, expected) => {
    expect(rotateRight(from(value), bits)).toEqual(from(expected))
  })
})

it('rotate left and rotate left are inverse functions', () => {
  assert(
    property(arb64Bits(), nat(64), (value, bits) => {
      const u64 = from(value, 2)
      expect(rotateLeft(rotateRight(u64, bits), bits)).toEqual(u64)
    })
  )
})
