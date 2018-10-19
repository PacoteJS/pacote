import { tryCatch, left, right, TaskEither } from 'fp-ts/lib/TaskEither'
import { task, Task } from 'fp-ts/lib/Task'
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

function parse<T>(response: Response): Promise<T | string> {
  const contentType = (response.headers.get('content-type') || '')
    .trim()
    .toLowerCase()
  return contentType.startsWith('application/json')
    ? response.json()
    : response.text()
}

function parseLeft<E>(response: Response): Promise<E | string> {
  return parse<E>(response.clone()).catch(() => response.text())
}

function statusError<E>(
  parseFn: (r: Response) => Promise<E>,
  response: Response
): Task<StatusError<E | string> | ParserError> {
  return new Task(() =>
    parseFn(response)
      .then(body => new StatusError(response.status, response.statusText, body))
      .catch(
        error =>
          new ParserError('Could not parse error response', [
            new StatusError(response.status, response.statusText),
            error
          ])
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
    tryCatch<FetchError<E | string>, Response>(
      () => f.fetch(input, init),
      error => new NetworkError('Network request failed', error as Error)
    )
      .chain(
        response =>
          response.ok
            ? right(task.of(response))
            : left<StatusError<E | string> | ParserError, Response>(
                statusError(f.parseLeft, response.clone())
              )
      )
      .chain(response =>
        tryCatch<ParserError, T | string>(
          () => f.parse(response.clone()),
          error => new ParserError('Could not parse response', error as Error)
        )
      )
}

export const ffetch = createFetch()
