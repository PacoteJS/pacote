export function isPlainObject(o: unknown): o is Record<string, unknown> {
  return (
    o != null &&
    typeof o === 'object' &&
    !Array.isArray(o) &&
    !(o instanceof Date) &&
    !(o instanceof RegExp) &&
    !(o instanceof Promise) &&
    !(o instanceof Map) &&
    !(o instanceof Set) &&
    !(o instanceof WeakMap) &&
    !(o instanceof WeakSet) &&
    !(o instanceof ArrayBuffer) &&
    !(o instanceof Float32Array) &&
    !(o instanceof Float64Array) &&
    !(o instanceof Int8Array) &&
    !(o instanceof Int16Array) &&
    !(o instanceof Int32Array) &&
    !(o instanceof Uint8Array) &&
    !(o instanceof Uint16Array) &&
    !(o instanceof Uint32Array) &&
    !(o instanceof Uint8ClampedArray) &&
    !(o instanceof BigUint64Array)
  )
}
