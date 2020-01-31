interface ThrottledFunction<T> {
  (...args: T[]): void
  cancel: () => void
}

export function throttle<T extends any, R extends any>(
  fn: (...args: T[]) => R,
  delay = 0
): ThrottledFunction<T> {
  let lastCalled = 0
  let leading = true
  let pending = false
  let timer: NodeJS.Timeout

  const cancel = () => {
    clearTimeout(timer)
    pending = false
    lastCalled = 0
  }

  const callFn = (...args: T[]): void => {
    lastCalled = Date.now()
    fn(...args)
  }

  const throttledFn = (...args: T[]): void => {
    const msSinceLastCall = Date.now() - lastCalled

    if (leading) {
      leading = false
      callFn(...args)
    } else if (!pending || msSinceLastCall < delay) {
      pending = true
      clearTimeout(timer)

      timer = setTimeout(() => {
        pending = false
        callFn(...args)
      }, delay - msSinceLastCall)
    }
  }

  throttledFn.cancel = cancel

  return throttledFn
}
