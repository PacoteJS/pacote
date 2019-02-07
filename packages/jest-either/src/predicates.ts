import { isPlainObject } from '@pacote/is-plain-object'
import { equals, map, where } from 'ramda'

export const whereMatch = (s: any) => (o: any) =>
  isPlainObject(o) ? where(map(whereMatch, s), o) : equals(s, o)
