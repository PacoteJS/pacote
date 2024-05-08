import { describe, test, expect } from 'vitest'
import * as L from '../src/index'

describe('entries()', () => {
  test('iterator is done for empty lists', () => {
    const list = L.listOf()
    const iterator = L.entries(list)

    expect(iterator.next().done).toEqual(true)
  })

  test('iterator holds undefined value for empty lists', () => {
    const list = L.listOf()
    const iterator = L.entries(list)

    expect(iterator.next().value).toEqual(undefined)
  })

  test('iterator is not done at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.entries(list)

    expect(iterator.next().done).toEqual(false)
  })

  test('iterator holds the head value at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.entries(list)

    expect(iterator.next().value).toEqual([0, 'value'])
  })

  test('iterator can iterate over multiple items', () => {
    const list = L.listOf('first', 'second')
    const iterator = L.entries(list)

    expect(iterator.next().value).toEqual([0, 'first'])
    expect(iterator.next().value).toEqual([1, 'second'])
    expect(iterator.next().done).toEqual(true)
  })
})

describe('keys()', () => {
  test('iterator is done for empty lists', () => {
    const list = L.listOf()
    const iterator = L.keys(list)

    expect(iterator.next().done).toEqual(true)
  })

  test('iterator holds undefined value for empty lists', () => {
    const list = L.listOf()
    const iterator = L.keys(list)

    expect(iterator.next().value).toEqual(undefined)
  })

  test('iterator is not done at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.keys(list)

    expect(iterator.next().done).toEqual(false)
  })

  test('iterator holds the head value at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.keys(list)

    expect(iterator.next().value).toEqual(0)
  })

  test('iterator can iterate over multiple items', () => {
    const list = L.listOf('first', 'second')
    const iterator = L.keys(list)

    expect(iterator.next().value).toEqual(0)
    expect(iterator.next().value).toEqual(1)
    expect(iterator.next().done).toEqual(true)
  })
})

describe('values()', () => {
  test('iterator is done for empty lists', () => {
    const list = L.listOf()
    const iterator = L.values(list)

    expect(iterator.next().done).toEqual(true)
  })

  test('iterator holds undefined value for empty lists', () => {
    const list = L.listOf()
    const iterator = L.values(list)

    expect(iterator.next().value).toEqual(undefined)
  })

  test('iterator is not done at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.values(list)

    expect(iterator.next().done).toEqual(false)
  })

  test('iterator holds the head value at the start of non-empty lists', () => {
    const list = L.listOf('value')
    const iterator = L.values(list)

    expect(iterator.next().value).toEqual('value')
  })

  test('iterator can iterate over multiple items', () => {
    const list = L.listOf('first', 'second')
    const iterator = L.values(list)

    expect(iterator.next().value).toEqual('first')
    expect(iterator.next().value).toEqual('second')
    expect(iterator.next().done).toEqual(true)
  })
})
