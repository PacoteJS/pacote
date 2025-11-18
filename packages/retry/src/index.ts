export interface RetryOptions {
  /**
   * Exponential backoff applied to the interval.
   */
  backoff?: number
  /**
   * Time in milliseconds between retry attempts. If a backoff is provided, the
   * interval between attempts will increase exponentially based on it.
   */
  interval?: number
  /**
   * Maximum number of times the invocation is retried.
   */
  retries?: number
  /**
   * Time in milliseconds after which the function will stop being retried.
   */
  timeout?: number
}

/**
 * Retries calling a function asynchronously.
 *
 * The handler accepts options that limit how many retries can be performed.
 *
 * @example
 * ```typescript
 * import { retry } from '@pacote/retry'
 *
 * await retry(async () => fetch(...), { retries: 3 })
 * ```
 *
 * @param callback  - Synchronous or asynchronous function to execute. The first
 *                    successful invocation result will by returned by `retry`.
 * @param [options] - Retry options.
 *
 * @returns The first successful result of the provided callback, or the last
 * error thrown by the callback before the function gives up retrying.
 */
export async function retry<T>(
  callback: () => T | Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    let intervalId: number | NodeJS.Timeout
    let timeoutId: number | NodeJS.Timeout
    let isPending = false
    let lastError: unknown
    let retryCount = 0

    if (options.timeout) {
      timeoutId = setTimeout(onTimeout, options.timeout)
    }

    intervalId = setInterval(evaluateCallback, options.interval)

    evaluateCallback()

    function clearTimers() {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }

    async function evaluateCallback() {
      if (isPending) return

      try {
        isPending = true
        const result = await callback()
        clearTimers()
        resolve(result)
      } catch (error) {
        if (options.backoff != null && options.interval != null) {
          clearInterval(intervalId)
          const nextInterval = options.backoff ** retryCount * options.interval
          intervalId = setInterval(evaluateCallback, nextInterval)
        }

        if (options.retries != null && retryCount >= options.retries) {
          clearTimers()
          reject(error)
        }

        retryCount++
        lastError = error
      } finally {
        isPending = false
      }
    }

    function onTimeout() {
      clearTimers()
      reject(lastError)
    }
  })
}
