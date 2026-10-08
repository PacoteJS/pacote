/**
 * Checks whether a value is a plain JavaScript object.
 *
 * Returns `false` for arrays, built-in objects, typed arrays, and primitive
 * values. This function narrows the value to a string-keyed record.
 *
 * @param o - Value to check.
 * @returns `true` when the value is a plain object.
 * @example
 * ```typescript
 * import { isPlainObject } from '@pacote/is-plain-object'
 *
 * isPlainObject({ answer: 42 }) // => true
 * isPlainObject({ an: 'object' }) // => true
 * isPlainObject({}) // => true
 * isPlainObject(undefined) // => false
 * isPlainObject(null) // => false
 * isPlainObject(false) // => false
 * isPlainObject(true) // => false
 * isPlainObject(NaN) // => false
 * isPlainObject(Infinity) // => false
 * isPlainObject(0) // => false
 * isPlainObject('string') // => false
 * isPlainObject([]) // => false
 * isPlainObject(new ArrayBuffer(0)) // => false
 * isPlainObject(new Date()) // => false
 * isPlainObject(new Map()) // => false
 * isPlainObject(Promise.resolve()) // => false
 * isPlainObject(new Set()) // => false
 * isPlainObject(new WeakMap()) // => false
 * isPlainObject(new WeakSet()) // => false
 * ```
 */
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
