import { optimal } from '../src/index'

test('calculate optimised size and hashes from length and error rate', () => {
  const optimizedOptions = optimal(2000, 0.005)
  expect(optimizedOptions).toEqual({ size: 22056, hashes: 8 })
})
