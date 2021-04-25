import { map } from '@pacote/result'

const property = <O, P extends keyof O>(name: P) => (response: O) =>
  response[name]

export const status = map<Response, Error, number>(property('status'))

export const statusText = map<Response, Error, string>(property('statusText'))
