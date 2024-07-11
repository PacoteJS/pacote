type UnknownRecord = Record<string | number | symbol, unknown>

export const keys = <O extends UnknownRecord>(o: O) => Object.keys(o) as (keyof O)[]

export const entries = <O extends UnknownRecord>(o: O) =>
  Object.entries(o) as [keyof O, O[keyof O]][]

export function pick<
  InputRecord extends UnknownRecord,
  PickedKey extends keyof InputRecord,
>(keys: PickedKey[], obj: InputRecord): Pick<InputRecord, PickedKey> {
  return keys.reduce(
    (picked, name) => {
      picked[name] = obj[name]
      return picked
    },
    {} as Pick<InputRecord, PickedKey>,
  )
}
