// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Throttled<A extends any[]> = (...args: A) => void

interface Cancellable {
  cancel: () => void
}

/**
 * Creates a throttled version of the passed function.
 *
 * By calling the throttled function repeatedly, the original function is called
 * once immediately and then at most once for every period of time determined by
 * the `delay` argument.
 *
 * @param fn    The function to throttle. Can accept any number of arguments.
 * @param delay The minimum time (in milliseconds) that must pass between successive calls.
 *              Defaults to 0.
 *
 * @returns A throttled version of the input function with an additional `cancel()` method.
 *          The cancel method can be used to reset the throttle timer.
 *
 * @example
 * import { throttle } from '@pacote/throttle'
 *
 * const throttledFn = throttle(fn, 100)
 *
 * throttledFn() // fn() is called immediately
 * throttledFn() // fn() is scheduled for execution after 100ms
 * throttledFn() // fn() is scheduled for execution, cancelling the previous one
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function throttle<A extends any[]>(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  fn: (...args: A) => any,
  delay = 0
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
    }
  })
}
