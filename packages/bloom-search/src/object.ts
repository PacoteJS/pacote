type AnyRecord = Record<string | number | symbol, unknown>

export const keys = <O extends AnyRecord>(o: O) => Object.keys(o) as (keyof O)[]

export const entries = <O extends AnyRecord>(o: O) =>
  Object.entries(o) as [keyof O, O[keyof O]][]

export function pick<
  UnknownRecord extends AnyRecord,
  PickedKey extends keyof UnknownRecord
>(keys: PickedKey[], obj: UnknownRecord): Pick<UnknownRecord, PickedKey> {
  return keys.reduce((picked, name) => {
    picked[name] = obj[name]
    return picked
  }, {} as Pick<UnknownRecord, PickedKey>)
}
