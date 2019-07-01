import { pipe } from 'fp-ts/lib/pipeable'
import { tryCatch, left, TaskEither, chain } from 'fp-ts/lib/TaskEither'
import { StatusError, NetworkError, FetchError, ParserError } from './errors'

type Fetch<E, T> = (
  input: Request | string,
  init?: RequestInit
) => TaskEither<FetchError<E | string>, T | string>

interface FetchOptions<E, T> {
  readonly fetch: (
    input: Request | string,
    init?: RequestInit
  ) => Promise<Response>
  readonly parse: (r: Response) => Promise<T>
  readonly parseLeft: (r: Response) => Promise<E>
}

async function parse<T>(response: Response): Promise<T | string> {
  const contentType = (response.headers.get('content-type') || '')
    .trim()
    .toLowerCase()
  return contentType.startsWith('application/json')
    ? response.json()
    : response.text()
}

async function parseLeft<E>(response: Response): Promise<E | string> {
  return parse<E>(response.clone()).catch(async () => response.text())
}

function handleSuccess<T>(
  parseFn: (r: Response) => Promise<T>,
  response: Response
): TaskEither<ParserError, T | string> {
  return tryCatch(
    async () => parseFn(response),
    error => new ParserError('Could not parse response', error as Error)
  )
}

function handleFailure<E>(
  parseFn: (r: Response) => Promise<E>,
  response: Response
): TaskEither<StatusError<E> | ParserError, never> {
  const statusError = (body?: E) =>
    new StatusError(response.status, response.statusText, body)

  return pipe(
    tryCatch(
      async () => parseFn(response).then(statusError),
      error =>
        new ParserError('Could not parse error response', [
          statusError(),
          error as Error
        ])
    ),
    chain(error => left<StatusError<E> | ParserError>(error))
  )
}

export function createFetch<E, T>(
  options?: Partial<FetchOptions<E, T>>
): Fetch<E, T> {
  const o: FetchOptions<E | string, T | string> = {
    fetch: window.fetch,
    parse,
    parseLeft,
    ...options
  }

  return (input, init) =>
    pipe(
      tryCatch(
        async () => o.fetch(input, init),
        error => new NetworkError('Network request failed', error as Error)
      ),
      chain(response =>
        response.ok
          ? handleSuccess(o.parse, response)
          : handleFailure(o.parseLeft, response)
      )
    )
}

export const ffetch = createFetch()
