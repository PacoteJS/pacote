export type RequestBody =
  | Blob
  | BufferSource
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | string

export type Stringifiable = string | boolean | number | null | undefined

export type RequestHeader = [name: string, value: string | boolean | number]

export type RequestInfo = {
  readonly method: string
  readonly url: string
  readonly headers: readonly RequestHeader[]
  readonly body?: RequestBody
}

const requestBuilder = (method: string) => (url: string): RequestInfo => ({
  url,
  method,
  headers: [],
})

export const CONNECT = requestBuilder('CONNECT')
export const DELETE = requestBuilder('DELETE')
export const GET = requestBuilder('GET')
export const HEAD = requestBuilder('HEAD')
export const OPTIONS = requestBuilder('OPTIONS')
export const PATCH = requestBuilder('PATCH')
export const POST = requestBuilder('POST')
export const PUT = requestBuilder('PUT')
export const TRACE = requestBuilder('TRACE')
