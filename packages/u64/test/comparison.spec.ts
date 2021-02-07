import { equals, from, greaterThan, lessThan } from '../src'

describe('equals', () => {
  it.each([
    ['0', '0', true],
    ['0', '1', false],
    ['4831838208', '8589934592', false],
    ['8589934592', '8589934592', true],
  ])('%s == %s', (a, b, expected) => {
    expect(equals(from(a), from(b))).toBe(expected)
  })
})

describe('greater than', () => {
  it.each([
    ['0', '0', false],
    ['0', '1', false],
    ['0', '65536', false],
    ['65536', '0', true],
    ['8589934592', '4294967296', true],
    ['4294967296', '2147483648', true],
    ['2415919104', '2415919104', false],
  ])('%s > %s', (a, b, expected) => {
    expect(greaterThan(from(a), from(b))).toBe(expected)
  })
})

describe('less than', () => {
  it.each([
    ['0', '0', false],
    ['0', '1', true],
    ['0', '65536', true],
    ['65536', '0', false],
    ['4294967296', '8589934592', true],
    ['2147483648', '4294967296', true],
    ['2415919104', '2415919104', false],
  ])('%s < %s', (a, b, expected) => {
    expect(lessThan(from(a), from(b))).toBe(expected)
  })
})
