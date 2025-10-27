type ReplaceMap<T> = { [placeholder: string]: T } | T[]

/**
 * Creates a renderer that substitutes placeholders in a template with values
 * provided at call time.
 *
 * The returned function accepts either an object keyed by placeholder names or
 * an array of values, in which case placeholders are numeric indices. Only raw
 * substitution is performed—no escaping, looping, or conditional logic.
 *
 * @param template Template containing placeholders to replace.
 * @param pattern  Pattern describing the placeholder delimiters. Defaults to
 *                 `/{{([\s\S]+?)}}/`. May be a string or `RegExp` and must
 *                 contain exactly one capture group for the placeholder key.
 *
 * @returns Function that receives replacement data and yields the interpolated
 *          string.
 *
 * @example
 * ```typescript
 * const render = interpolate('Hello, {{ name }}!')
 *
 * render({ name: 'world' }) // => 'Hello, world!'
 * ```
 *
 * @example
 * ```typescript
 * const render = interpolate('Hello, {{0}} and {{1}}!')
 *
 * render(['Alice', 'Bob']) // => 'Hello, Alice and Bob!'
 * ```
 *
 * @example
 * ```typescript
 * const render = interpolate('Hello, %{name}!', /%{([\s\S]+?)}/)
 *
 * render({ name: 'world' }) // => 'Hello, world!'
 * ```
 */
export function interpolate(
  template: string,
  pattern: RegExp | string = /{{([\s\S]+?)}}/,
) {
  const regexp = RegExp(pattern, 'g')

  return (data: ReplaceMap<string | number | null | undefined> = {}): string =>
    template.replace(regexp, (_match, capture = '') => {
      const key = capture.trim()
      const value = Array.isArray(data)
        ? data[Number.parseInt(key, 10)]
        : data[key]
      return String(value ?? '')
    })
}
