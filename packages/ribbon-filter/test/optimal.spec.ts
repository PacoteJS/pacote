import { expect, test } from 'vitest'
import { optimal } from '../src/index'

test.each([
  [2000, 0.005, 2100, 8],
  [1000, 0.0001, 1050, 14],
  [1000, 0.0005, 1050, 11],
  [1000, 0.0000001, 1050, 24],
  [10, 0.5, 11, 1],
  [0, 0.01, 1, 7],
])(
  'calculate optimised size and fingerprint bits for %i items at error rate %d',
  (items, errorRate, size, fingerprintBits) => {
    expect(optimal(items, errorRate)).toEqual({ size, fingerprintBits })
  },
)

test('fingerprint bits are capped at 32', () => {
  expect(optimal(1000, 1e-12).fingerprintBits).toBe(32)
})
