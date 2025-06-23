type ReplaceMap<T> = { [placeholder: string]: T } | T[]

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
