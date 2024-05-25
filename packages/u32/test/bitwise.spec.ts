import { assert, array, nat, property } from 'fast-check'
import { describe, expect, it } from 'vitest'
import {
  and,
  from,
  or,
  rotateLeft,
  rotateRight,
  shiftLeft,
  shiftRight,
  xor,
} from '../src/index'

const arb32Bits = () => array(nat(1), { maxLength: 32 }).map((a) => a.join(''))

describe('and', () => {
  it('is consistent with numeric bitwise and', () => {
    assert(
      property(nat(), nat(), (a, b) => {
        expect(and(from(a), from(b))).toEqual(from(a & b))
      }),
    )
  })
})

describe('or', () => {
  it('is consistent with numeric bitwise or', () => {
    assert(
      property(nat(), nat(), (a, b) => {
        expect(or(from(a), from(b))).toEqual(from(a | b))
      }),
    )
  })
})

describe('xor', () => {
  it('is consistent with numeric bitwise xor', () => {
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
    ['1', 32, '0'],
    ['1', 31, '2147483648'],
    ['9', 28, '2415919104'],
    ['4294967296', 1, '8589934592'],
    ['2147483648', 1, '4294967296'],
    ['2415919104', 1, '4831838208'],
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
    ['2147483648', 31, '1'],
    ['2415919104', 28, '9'],
    ['1', 32, '1'],
  ])(`shifts %s right by %d bits`, (value, bits, expected) => {
    expect(shiftRight(from(value), bits)).toEqual(from(expected))
  })
})

describe('rotate left', () => {
  it.each([
    ['0', 1, '0'],
    ['1', 2, '4'],
    ['1', 16, '65536'],
  ])('rotates %s left by %d bits', (value, bits, expected) => {
    expect(rotateLeft(from(value), bits)).toEqual(from(expected))
  })

  it('rotates 0 bits to return the same number', () => {
    assert(
      property(arb32Bits(), (value) => {
        const u32 = from(value, 2)
        expect(rotateLeft(u32, 0)).toEqual(u32)
      }),
    )
  })

  it('rotates 32 bits to return the same number', () => {
    assert(
      property(arb32Bits(), (value) => {
        const u32 = from(value, 2)
        expect(rotateLeft(u32, 32)).toEqual(u32)
      }),
    )
  })
})

describe('rotate right', () => {
  it.each([
    ['0', 1, '0'],
    ['4', 2, '1'],
    ['65536', 16, '1'],
  ])('rotates %s right by %d bits', (value, bits, expected) => {
    expect(rotateRight(from(value), bits)).toEqual(from(expected))
  })

  it('rotates 0 bits to return the same number', () => {
    assert(
      property(arb32Bits(), (value) => {
        const u32 = from(value, 2)
        expect(rotateRight(u32, 0)).toEqual(u32)
      }),
    )
  })

  it('rotates 32 bits to return the same number', () => {
    assert(
      property(arb32Bits(), (value) => {
        const u32 = from(value, 2)
        expect(rotateRight(u32, 32)).toEqual(u32)
      }),
    )
  })
})

it('rotate left and rotate left are inverse functions', () => {
  assert(
    property(arb32Bits(), nat(32), (value, bits) => {
      const u32 = from(value, 2)
      expect(rotateLeft(rotateRight(u32, bits), bits)).toEqual(u32)
    }),
  )
})
