interface ThrottledFunction<T> {
  (...args: T[]): void
  cancel: () => void
}

export function throttle<T extends any>(
  fn: (...args: T[]) => any,
  delay = 0
): ThrottledFunction<T> {
  let lastCalled = 0
  let timer: NodeJS.Timeout

  const throttledFn = (...args: T[]): void => {
    const remainingDelay = Math.max(0, lastCalled + delay - Date.now())

    if (remainingDelay) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        lastCalled = Date.now()
        fn(...args)
      }, remainingDelay)
    } else {
      lastCalled = Date.now()
      fn(...args)
    }
  }

  throttledFn.cancel = () => {
    lastCalled = 0
    clearTimeout(timer)
  }

  return throttledFn
}
