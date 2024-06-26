import { type MockInstance, afterEach, expect, test, vi } from 'vitest'
import { throttle } from '../src/index'

const tock = (() => {
  let spy: MockInstance<[], number> = vi.fn()
  let mockedTime = 0

  return {
    useFakeTime(time = 0) {
      mockedTime = time
      spy.mockRestore()
      spy = vi.spyOn(Date, 'now').mockReturnValue(mockedTime)
      vi.useFakeTimers()
    },

    advanceTime(time = 0) {
      mockedTime = mockedTime + time
      spy.mockReturnValue(mockedTime)
      vi.advanceTimersByTime(time)
    },

    useRealTime() {
      spy.mockRestore()
      vi.useRealTimers()
    },
  }
})()

afterEach(() => {
  tock.useRealTime()
})

test('throttled function is called immediately', () => {
  const fn = vi.fn()
  const throttledFn = throttle(fn)

  throttledFn()

  expect(fn).toHaveBeenCalledTimes(1)
})

test('throttled function is called with the passed arguments', () => {
  const fn = vi.fn()
  const throttledFn = throttle(fn)

  throttledFn(1, 2, 3)

  expect(fn).toHaveBeenCalledWith(1, 2, 3)
})

test('throttled functions can be called past the delay interval', () => {
  tock.useFakeTime(Date.now())

  const fn = vi.fn()
  const throttledFn = throttle(fn, 100)

  throttledFn(1)
  throttledFn(2)
  tock.advanceTime(100)
  throttledFn(3)
  tock.advanceTime(100)

  expect(fn).toHaveBeenCalledTimes(3)
})

test('throttled function can be called at most once during the delay interval', () => {
  tock.useFakeTime(Date.now())

  const fn = vi.fn()
  const throttledFn = throttle(fn, 100)

  throttledFn(1)
  throttledFn(2)
  tock.advanceTime(99)

  expect(fn).toHaveBeenCalledWith(1)
  expect(fn).not.toHaveBeenCalledWith(2)
})

test('throttled function only considers the most recent call', () => {
  tock.useFakeTime(Date.now())

  const fn = vi.fn()
  const throttledFn = throttle(fn, 100)

  throttledFn(1)
  throttledFn(2)
  throttledFn(3)
  tock.advanceTime(100)

  expect(fn).toHaveBeenCalledWith(1)
  expect(fn).not.toHaveBeenCalledWith(2)
  expect(fn).toHaveBeenCalledWith(3)
})

test('cancelling pending function calls', () => {
  tock.useFakeTime(Date.now())

  const fn = vi.fn()
  const throttledFn = throttle(fn, 100)

  throttledFn(1)
  throttledFn(2)
  throttledFn.cancel()
  tock.advanceTime(100)
  throttledFn(3)
  tock.advanceTime(100)

  expect(fn).toHaveBeenCalledWith(1)
  expect(fn).not.toHaveBeenCalledWith(2)
  expect(fn).toHaveBeenCalledWith(3)
})
