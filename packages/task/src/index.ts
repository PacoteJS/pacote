export type Task<T> = () => Promise<T>

/**
 * Creates a new task that asynchronously resolves to the provided result.
 *
 * @param result Result to resolve the task with.
 *
 * @returns A new task that resolves to the provided result.
 */
export function Task<T>(result: T): Task<T> {
  return () => Promise.resolve(result)
}

/**
 * Applies a function to transform the result of a task, allowing task results
 * processing to be chained.
 *
 * @param fn Function to apply to the result.
 * @param task Task to map.
 *
 * @returns Mapped task.
 */
export function map<T, R>(fn: (value: T) => R, task: Task<T>): Task<R> {
  return () => task().then(fn)
}

/**
 * Applies a function to transform the result of a task into a new task,
 * allowing task results processing to be chained.
 *
 * @param fn Function to apply to the result, creating a new task.
 * @param task Task to flatmap.
 *
 * @returns Flatmapped task.
 */
export function flatMap<T, R>(fn: (result: T) => Task<R>, task: Task<T>): Task<R> {
  return () => task().then((result) => fn(result)())
}

/**
 * Flatten a nested task into a single task.
 *
 * @param task Task to flatten.
 *
 * @returns Flattened task.
 */
export function flatten<T>(task: Task<Task<T>>): Task<T> {
  return flatMap((i) => i, task)
}
