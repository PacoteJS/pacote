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
} from '../src'

const arb64Bits = () => array(nat(1), { maxLength: 64 }).map((a) => a.join(''))

describe('and', () => {
  it('consistent with numeric bitwise and', () => {
    assert(
      property(nat(), nat(), (a, b) => {
        expect(and(from(a), from(b))).toEqual(from(a & b))
      }),
    )
  })
})

describe('or', () => {
  it('consistent with numeric bitwise or', () => {
    assert(
      property(nat(), nat(), (a, b) => {
        expect(or(from(a), from(b))).toEqual(from(a | b))
      }),
    )
  })
})

describe('xor', () => {
  it('consistent with numeric bitwise xor', () => {
    assert(
      property(nat(), nat(), (a, b) => {
        expect(xor(from(a), from(b))).toEqual(from(a ^ b))
      }),
    )
  })
})

describe('shift left', () => {
  it.each([
    ['1', 0, '1'],
    ['0', 1, '0'],
    ['1', 2, '4'],
    ['1', 16, '65536'],
    ['1', 32, '4294967296'],
    ['1', 31, '2147483648'],
    ['9', 28, '2415919104'],
    ['4294967296', 1, '8589934592'],
    ['2147483648', 1, '4294967296'],
    ['2415919104', 1, '4831838208'],
    ['18446744073709551615', 8, '4722366482869645213440'],
    ['18446744073709551615', 16, '1208925819614629174640640'],
    ['18446744073709551615', 32, '79228162514264337589248983040'],
    ['18446744073709551615', 48, '5192296858534827628249021352509440'],
  ])('shifts %d left by %d bits', (value, bits, expected) => {
    expect(shiftLeft(from(value), bits)).toEqual(from(expected))
  })
})

describe('shift right', () => {
  it.each([
    ['1', 0, '1'],
    ['0', 1, '0'],
    ['4', 2, '1'],
    ['65536', 16, '1'],
    ['1', 32, '0'],
    ['2147483648', 31, '1'],
    ['2415919104', 28, '9'],
    ['18446744073709551615', 8, '72057594037927935'],
    ['18446744073709551615', 16, '281474976710655'],
    ['18446744073709551615', 32, '4294967295'],
    ['18446744073709551615', 48, '65535'],
  ])(`shifts %s right by %d bits`, (value, bits, expected) => {
    expect(shiftRight(from(value), bits)).toEqual(from(expected))
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
    }),
  )
})
