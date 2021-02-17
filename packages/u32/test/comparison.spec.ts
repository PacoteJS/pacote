import { equals, from, greaterThan, lessThan } from '../src/index'

describe('equals', () => {
  it.each([
    ['0', '0', true],
    ['0', '1', false],
    ['4831838208', '4831838208', true],
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
    ['4294967295', '2147483648', true],
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
    ['2147483648', '4294967295', true],
    ['2415919104', '2415919104', false],
  ])('%s < %s', (a, b, expected) => {
    expect(lessThan(from(a), from(b))).toBe(expected)
  })
})
