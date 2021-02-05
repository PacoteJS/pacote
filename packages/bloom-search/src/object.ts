export const keys = <O>(o: O) => Object.keys(o) as (keyof O)[]

export const entries = <O>(o: O) => Object.entries(o) as [keyof O, O[keyof O]][]

export function pick<
  UnknownRecord extends Record<string | number | symbol, unknown>,
  PickedKey extends keyof UnknownRecord
>(keys: PickedKey[], obj: UnknownRecord): Pick<UnknownRecord, PickedKey> {
  return keys.reduce((picked, name) => {
    picked[name] = obj[name]
    return picked
  }, {} as Pick<UnknownRecord, PickedKey>)
}
