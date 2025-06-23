import { expect, test } from 'vitest'
import { retry } from '../src/index'

test('evaluating a callback and returning its result', async () => {
  await expect(retry(() => 'ok')).resolves.toBe('ok')
})

test('evaluating an async callback and returning its result', async () => {
  await expect(retry(async () => 'ok')).resolves.toBe('ok')
})

test('retrying the callback until it succeeds', async () => {
  let calls = 0

  await retry(() => {
    if (++calls < 2) {
      throw new Error()
    }
  })

  expect(calls).toBe(2)
})

test('rejecting with the latest error after retrying a maximum number of times', async () => {
  let calls = 0

  const result = retry(
    () => {
      throw new Error(`called ${++calls} times`)
    },
    { retries: 2 },
  )

  await expect(result).rejects.toEqual(new Error('called 3 times'))
})

test('retrying with an interval', async () => {
  let calls = 0
  const start = new Date()

  await retry(
    () => {
      if (++calls < 2) {
        throw Error()
      }
    },
    { interval: 50 },
  )

  // Add a small buffer to account for timing variations
  expect(Date.now() - start.getTime()).toBeGreaterThanOrEqual(45)
})

test('retrying until there is a timeout', async () => {
  const start = new Date()

  await expect(
    retry(
      () => {
        throw new Error()
      },
      { interval: 10, timeout: 50 },
    ),
  ).rejects.toBeInstanceOf(Error)

  expect(Date.now() - start.getTime()).toBeGreaterThanOrEqual(50)
})

test('retrying with an exponential backoff', async () => {
  let calls = 0
  const start = new Date()

  await retry(
    () => {
      if (++calls < 4) {
        throw Error()
      }
    },
    { backoff: 2, interval: 10 },
  )

  expect(Date.now() - start.getTime()).toBeGreaterThanOrEqual(70)
})

test('do not call a slow async callback until the previous call has finished', async () => {
  let calls = 0

  await retry(
    async () => {
      calls++
      return new Promise((resolve) => setTimeout(resolve, 10))
    },
    { interval: 1 },
  )

  expect(calls).toBe(1)
})
