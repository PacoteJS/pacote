import { tryCatch, left2v, TaskEither, chain } from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
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
  return pipe(
    tryCatch(
      async () => parseFn(response),
      error =>
        new ParserError('Could not parse error response', [
          new StatusError(response.status, response.statusText),
          error as Error
        ])
    ),
    chain(body =>
      left2v<StatusError<E> | ParserError>(
        new StatusError(response.status, response.statusText, body)
      )
    )
  )
}

export function createFetch<E, T>(
  fetchOptions?: Partial<FetchOptions<E, T>>
): Fetch<E, T> {
  const f: FetchOptions<E | string, T | string> = {
    fetch: window.fetch,
    parse,
    parseLeft,
    ...fetchOptions
  }

  return (input, init) =>
    pipe(
      tryCatch(
        async () => f.fetch(input, init),
        error => new NetworkError('Network request failed', error as Error)
      ),
      chain(response =>
        response.ok
          ? handleSuccess(f.parse, response)
          : handleFailure(f.parseLeft, response)
      )
    )
}

export const ffetch = createFetch()
