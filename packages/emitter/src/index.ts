interface Events {
  [name: string]: (...args: unknown[]) => void
}

interface Emitter<E extends Events> {
  on<K extends keyof E>(name: K, fn: E[K]): () => void
  emit<K extends keyof E>(name: K, ...args: Parameters<E[K]>): void
}

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
