import { expect, test } from 'vitest'
import { optimal } from '../src/index'

test.each([
  [0.5, 1],
  [0.01, 7],
  [0.005, 8],
  [0.0001, 14],
  [0.0000001, 24],
])(
  'calculate fingerprint bits for error rate %d',
  (errorRate, fingerprintBits) => {
    expect(optimal(errorRate)).toEqual({ fingerprintBits })
  },
)

test('fingerprint bits are capped at 32', () => {
  expect(optimal(1e-12).fingerprintBits).toBe(32)
})
