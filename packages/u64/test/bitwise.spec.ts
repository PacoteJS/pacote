import { assert, nat, property } from 'fast-check'
import { from, rotateLeft, shiftLeft, shiftRight, xor, ZERO } from '../src'

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
    [1, 0, from(1)],
    [0, 1, ZERO],
    [1, 2, from(4)],
    [1, 16, from(65536)],
    [1, 32, from('4294967296')],
    [1, 64, from(1)],
  ])('rotates %d by %d bits', (value, bits, expected) => {
    expect(rotateLeft(from(value), bits)).toEqual(expected)
  })
})
