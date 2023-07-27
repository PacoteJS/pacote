import { assert, nat, integer, property } from 'fast-check'
import {
  add,
  divide,
  from,
  multiply,
  remainder,
  subtract,
  ZERO,
} from '../src/index'

describe('addition', () => {
  it('commutative property', () => {
    assert(
      property(nat().map(from), nat().map(from), (a, b) => {
        expect(add(a, b)).toEqual(add(b, a))
      }),
    )
  })

  it('associative property', () => {
    assert(
      property(nat().map(from), nat().map(from), nat().map(from), (a, b, c) => {
        expect(add(a, add(b, c))).toEqual(add(add(a, b), c))
      }),
    )
  })

  it('additive identity property', () => {
    assert(
      property(nat().map(from), (value) => {
        expect(add(value, from(0))).toEqual(value)
      }),
    )
  })

  it('consistent with numeric addition', () => {
    assert(
      property(nat(), nat(), (a, b) => {
        expect(add(from(a), from(b))).toEqual(from(a + b))
      }),
    )
  })
})

describe('multiplication', () => {
  it('commutative property', () => {
    assert(
      property(nat().map(from), nat().map(from), (a, b) => {
        expect(multiply(a, b)).toEqual(multiply(b, a))
      }),
    )
  })

  it('associative property', () => {
    assert(
      property(nat().map(from), nat().map(from), nat().map(from), (a, b, c) => {
        expect(multiply(a, multiply(b, c))).toEqual(multiply(multiply(a, b), c))
      }),
    )
  })

  it('distributive property', () => {
    assert(
      property(nat().map(from), nat().map(from), nat().map(from), (a, b, c) => {
        expect(multiply(a, add(b, c))).toEqual(
          add(multiply(a, b), multiply(a, c)),
        )
      }),
    )
  })

  it('multiplicative identity property', () => {
    assert(
      property(nat().map(from), (value) => {
        expect(multiply(value, from(1))).toEqual(value)
      }),
    )
  })

  it('null property', () => {
    assert(
      property(nat().map(from), (value) => {
        expect(multiply(value, ZERO)).toEqual(ZERO)
      }),
    )
  })
})

describe('subtraction', () => {
  it('consistent with numeric subtraction', () => {
    assert(
      property(
        integer({ min: 1000, max: 10000 }),
        integer({ min: 1, max: 1000 }),
        (a, b) => {
          expect(subtract(from(a), from(b))).toEqual(from(a - b))
        },
      ),
    )
  })
})

describe('division', () => {
  it('throws error on division by 0', () => {
    expect(() => divide(from(1), ZERO)).toThrow('division by zero')
  })

  it('is consistent with numeric division', () => {
    assert(
      property(nat(), integer({ min: 1 }), (a, b) => {
        expect(divide(from(a), from(b))).toEqual(from(Math.floor(a / b)))
      }),
    )
  })

  it.each([
    ['0', '1', '0'],
    ['2', '2', '1'],
  ])('%s % %s', (a, b, expected) => {
    expect(divide(from(a), from(b))).toEqual(from(expected))
  })
})

describe('remainder', () => {
  it('throws error on division by 0', () => {
    expect(() => remainder(from(1), ZERO)).toThrow('division by zero')
  })

  it('is consistent with numeric remainder', () => {
    assert(
      property(nat(), integer({ min: 1 }), (a, b) => {
        expect(remainder(from(a), from(b))).toEqual(from(Math.floor(a % b)))
      }),
    )
  })

  it.each([
    ['0', '1', '0'],
    ['2', '2', '0'],
  ])('%s % %s', (a, b, expected) => {
    expect(remainder(from(a), from(b))).toEqual(from(expected))
  })
})
