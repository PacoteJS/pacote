import { throttle } from '../src/index'

const watch = (() => {
  let spy: jest.SpyInstance<number, []>
  let mockedTime = 0

  return {
    useFakeTime(time = 0) {
      mockedTime = time
      // eslint-disable-next-line no-unused-expressions
      spy?.mockRestore()
      spy = jest.spyOn(Date, 'now').mockReturnValue(mockedTime)
      jest.useFakeTimers()
    },

    advanceTime(time = 0) {
      mockedTime = mockedTime + time
      spy.mockReturnValue(mockedTime)
      jest.advanceTimersByTime(time)
    },

    useRealTime() {
      // eslint-disable-next-line no-unused-expressions
      spy?.mockRestore()
      jest.useRealTimers()
    }
  }
})()

afterEach(watch.useRealTime)

test(`throttled function is called immediately`, () => {
  const fn = jest.fn()
  const throttledFn = throttle(fn)

  throttledFn()

  expect(fn).toHaveBeenCalledTimes(1)
})

test(`throttled function is called with the passed arguments`, () => {
  const fn = jest.fn()
  const throttledFn = throttle(fn)

  throttledFn(1, 2, 3)

  expect(fn).toHaveBeenCalledWith(1, 2, 3)
})

test(`throttled function is always called within intervals of at least the wait period`, () => {
  watch.useFakeTime(Date.now())

  const fn = jest.fn()
  const throttledFn = throttle(fn, 100)

  throttledFn(1)
  throttledFn(2)
  watch.advanceTime(100)
  throttledFn(3)
  watch.advanceTime(100)

  expect(fn).toHaveBeenCalledTimes(3)
})

test(`throttled function is never called more than once during the wait period`, () => {
  watch.useFakeTime(Date.now())

  const fn = jest.fn()
  const throttledFn = throttle(fn, 100)

  throttledFn(1)
  throttledFn(2)
  watch.advanceTime(99)

  expect(fn).toHaveBeenCalledWith(1)
  expect(fn).not.toHaveBeenCalledWith(2)
})

test(`throttled function only considers the most recent call`, () => {
  watch.useFakeTime(Date.now())

  const fn = jest.fn()
  const throttledFn = throttle(fn, 100)

  throttledFn(1)
  throttledFn(2)
  watch.advanceTime(1)
  throttledFn(3)
  watch.advanceTime(99)

  expect(fn).not.toHaveBeenCalledWith(2)
  expect(fn).toHaveBeenCalledWith(3)
})

test(`cancelling pending function calls`, () => {
  watch.useFakeTime(Date.now())

  const fn = jest.fn()
  const throttledFn = throttle(fn, 100)

  throttledFn()
  throttledFn()
  throttledFn.cancel()
  watch.advanceTime(200)
  throttledFn()
  watch.advanceTime(200)

  expect(fn).toHaveBeenCalledTimes(2)
})

test.todo(`throttled function returns the result of a single invokation`)

test.todo(
  `throttled function returns the most recent result of multiple invokations`
)
