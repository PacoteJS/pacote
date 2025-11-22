import { unique } from '@pacote/array'

interface Events {
  // Allow event maps with specific parameter lists to satisfy the constraint.
  // biome-ignore lint/suspicious/noExplicitAny: any argument
  [name: string]: (...args: any[]) => void
}

/**
 * Configuration passed when registering a subscriber.
 */
export interface SubscriberOptions {
  /**
   * Abort signal that automatically removes the subscriber when triggered.
   */
  signal?: AbortSignal
}

export interface Emitter<E extends Events> {
  /**
   * Binds a subscriber function to an event with the supplied name.
   *
   * @param name    Event name.
   * @param fn      Subscriber to invoke when the event is emitted.
   * @param options Optional subscription options. If `options.signal` is
   *                provided, the subscriber is automatically removed when the
   *                signal is aborted.
   *
   *
   * @returns Function to unbind the event.
   *
   * @example
   *
   * ```typescript
   * const emitter = createEmitter()
   *
   * const unbind = emitter.on('greet', () => console.log('Hello, world!'))
   *
   * emitter.emit('greet') // triggers the callback
   * unbind()
   * emitter.emit('greet') // no longer triggers the callback
   * ```
   *
   * @example
   *
   * ```typescript
   * const emitter = createEmitter()
   * const controller = new AbortController()
   *
   * emitter.on(
   *   'greet',
   *   () => console.log('Hello, world!'),
   *   { signal: controller.signal }
   * )
   *
   * emitter.emit('greet') // triggers the callback
   * controller.abort()
   * emitter.emit('greet') // no longer triggers the callback
   * ```
   */
  on<K extends keyof E>(
    name: K,
    fn: E[K],
    options?: SubscriberOptions,
  ): () => void

  /**
   * Fires the named event, triggering any subscribers previously bound to
   * it using the `.on()` method. Arguments provided after the name are
   * passed to the subscriber function.
   *
   * @param name Event name.
   * @param args Optional subscriber parameters.
   *
   * @example
   *
   * ```typescript
   * const emitter = createEmitter()
   * emitter.on('greet', (name) => console.log(`Hello, ${name}!`))
   *
   * emitter.emit('greet', 'Pacote') // => 'Hello, Pacote!'
   * ```
   */
  emit<K extends keyof E>(name: K, ...args: Parameters<E[K]>): void
}

/**
 * Creates a new instance of an event emitter.
 *
 * @returns Event emitter.
 *
 * @example
 *
 * ```typescript
 * import { createEmitter } from '@pacote/emitter'
 *
 * const emitter = createEmitter()
 * emitter.on('greet', () => console.log('Hello, world!'))
 * emitter.emit('greet') // => 'Hello, world!'
 * ```
 */
export function createEmitter<E extends Events>(): Emitter<E> {
  const listeners: Partial<{ [K in keyof E]: E[K][] }> = {}

  return {
    on(name, fn, options) {
      listeners[name] = unique(listeners[name]?.concat(fn) ?? [fn])

      const unbind = () => {
        listeners[name] = listeners[name]?.filter((cb) => cb !== fn)
      }

      if (options?.signal != null && !options.signal.aborted) {
        options.signal.addEventListener('abort', unbind)
      }

      return unbind
    },
    emit(name, ...args) {
      for (const fn of listeners[name] ?? []) {
        fn(...args)
      }
    },
  }
}
