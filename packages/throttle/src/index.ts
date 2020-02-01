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
    lastCalled = 0
    pending = false
    clearTimeout(timer)
  }

  const callFn = (...args: T[]): void => {
    lastCalled = Date.now()
    fn(...args)
  }

  const throttledFn = (...args: T[]): void => {
    const msSinceLastCall = Date.now() - lastCalled
    const remainingDelay = Math.max(0, delay - msSinceLastCall)

    if (leading) {
      leading = false
      callFn(...args)
    } else if (lastCalled === 0 || !pending || remainingDelay) {
      pending = true
      clearTimeout(timer)

      timer = setTimeout(() => {
        pending = false
        callFn(...args)
      }, remainingDelay)
    }
  }

  throttledFn.cancel = cancel

  return throttledFn
}
