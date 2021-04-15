export {
  RequestBody,
  RequestHeader,
  RequestInfo,
  CONNECT,
  DELETE,
  GET,
  HEAD,
  OPTIONS,
  PATCH,
  POST,
  PUT,
  TRACE,
} from './request'
export { body, json, text } from './body'
export { header } from './header'
export { query } from './query'
export { status, statusText } from './status'
export { send } from './send'

export const waitFor = <T, R>(fn: (value: T) => R) => (promise: Promise<T>) =>
  promise.then(fn)
