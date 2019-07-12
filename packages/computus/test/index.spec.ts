import { assert, property, integer } from 'fast-check'
import { gregorian } from '../src/index'

test('Easter 2019', () => {
  expect(gregorian(2019)).toEqual(new Date(2019, 3, 21))
})

test('Easter is on or after 22 March', () => {
  assert(
    property(integer(1583, 65536), year => {
      expect(gregorian(year).getTime()).toBeGreaterThanOrEqual(
        new Date(year, 2, 22).getTime()
      )
    })
  )
})

test('Easter is on or before 25 April', () => {
  assert(
    property(integer(1583, 65536), year => {
      expect(gregorian(year).getTime()).toBeLessThanOrEqual(
        new Date(year, 3, 25).getTime()
      )
    })
  )
})

test('Easter falls on a Sunday', () => {
  assert(
    property(integer(1583, 65536), year => {
      expect(gregorian(year).getDay()).toBe(0)
    })
  )
})
