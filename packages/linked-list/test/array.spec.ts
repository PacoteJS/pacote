import * as fc from 'fast-check'
import * as L from '../src/index'

describe('toArray()', () => {
  test('an empty linked list is converted to an empty array', () => {
    const list = L.listOf()
    expect(L.toArray(list)).toEqual([])
  })

  test('linked lists can be converted to and from arrays', () => {
    const arbitraryArray = fc.array(fc.anything())

    fc.assert(
      fc.property(arbitraryArray, (items) =>
        expect(L.toArray(L.listOf(...items))).toEqual(items),
      ),
    )
  })
})
