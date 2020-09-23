interface Events {
  [name: string]: (...args: any[]) => void
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        events[name] = events[name]!.filter((cb) => cb !== fn)
      }
    },
    emit(name, ...args) {
      events[name]?.forEach((fn) => fn(...args))
    },
  }
}
