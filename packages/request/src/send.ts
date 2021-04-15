import { ofPromise } from '@pacote/result'
import { RequestHeader, RequestInfo } from './request'

function toFetchHeaders(headers: readonly RequestHeader[]): Headers {
  return headers.reduce((acc, [name, value]) => {
    acc.append(name, String(value))
    return acc
  }, new Headers())
}

export const send = (fetchFn = fetch) => ({
  url,
  method,
  body,
  headers,
}: RequestInfo) =>
  ofPromise(
    fetchFn(url, {
      method,
      headers: toFetchHeaders(headers),
      body,
    })
  )
