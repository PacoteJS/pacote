interface Events {
  // Allow event maps with specific parameter lists to satisfy the constraint.
  // biome-ignore lint/suspicious/noExplicitAny: any argument
  [name: string]: (...args: any[]) => void
}

interface Emitter<E extends Events> {
  /**
   * Binds a subscriber function to an event with the supplied name.
   *
   * @param name Event name.
   * @param fn   Subscriber to invoke when the event is emitted.
   *
   * @returns Function to unbind the event.
   *
   * @example
   *
   * ```typescript
   * const emitter = createEmitter()
   * const unbind = emitter.on('greet', () => console.log('Hello, world!'))
   *
   * emitter.emit('greet') // triggers the callback
   *
   * unbind()
   *
   * emitter.emit('greet') // no longer triggers the callback
   * ```
   */
  on<K extends keyof E>(name: K, fn: E[K]): () => void

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
   *
   * const unbind = emitter.on('greet', (name) => console.log(`Hello, ${name}!`))
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
  const events: Partial<{ [K in keyof E]: E[K][] }> = {}

  return {
    on(name, fn) {
      events[name] = events[name]?.concat(fn) ?? [fn]

      return () => {
        events[name] = events[name]?.filter((cb) => cb !== fn)
      }
    },
    emit(name, ...args) {
      for (const fn of events[name] ?? []) {
        fn(...args)
      }
    },
  }
}
