// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Throttled<A extends any[]> = (...args: A) => void

interface Cancellable {
  cancel: () => void
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function throttle<A extends any[]>(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  fn: (...args: A) => any,
  delay = 0,
): Throttled<A> & Cancellable {
  let lastCalled = 0
  let timer: NodeJS.Timeout

  const throttledFn: Throttled<A> = (...args) => {
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

  return Object.assign<Throttled<A>, Cancellable>(throttledFn, {
    cancel: () => {
      lastCalled = 0
      clearTimeout(timer)
    },
  })
}
