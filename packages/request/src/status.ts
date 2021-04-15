import { mapC } from './result'

const property = <O, P extends keyof O>(name: P) => (response: O) =>
  response[name]

export const status = mapC<Response, Error, number>(property('status'))

export const statusText = mapC<Response, Error, string>(property('statusText'))
