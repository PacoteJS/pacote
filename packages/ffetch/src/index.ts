import { pipe } from 'fp-ts/function'
import {
  chain,
  chainW,
  left,
  type TaskEither,
  tryCatch,
} from 'fp-ts/lib/TaskEither'
import {
  type FetchError,
  NetworkError,
  ParserError,
  StatusError,
} from './errors'

type Fetch<E, T> = (
  input: Request | string,
  init?: RequestInit,
) => TaskEither<FetchError<E | string>, T | string>

interface FetchOptions<E, T> {
  /**
   * Fetch implementation; defaults to `window.fetch`.
   * Supply a Fetch-compatible polyfill where `fetch` is not global.
   * @example
   * ```typescript
   * const request = createFetch({ fetch: unfetch })
   * ```
   */
  readonly fetch: (
    input: Request | string,
    init?: RequestInit,
  ) => Promise<Response>
  /**
   * Parses successful responses; defaults to JSON for JSON content types and
   * text otherwise. Use this to parse another response format or include
   * response metadata in the returned value.
   * @example
   * ```typescript
   * const binaryFetch = createFetch({ parse: (response) => response.blob() })
   * ```
   */
  readonly parse: (r: Response) => Promise<T>
  /**
   * Parses non-success response bodies; defaults to the same JSON/text parsing
   * used for successful responses.
   * @example
   * ```typescript
   * const request = createFetch({
   *   parseLeft: (response) => response.status >= 500
   *     ? response.text()
   *     : response.json(),
   * })
   * ```
   */
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
  response: Response,
): TaskEither<ParserError, T | string> {
  return tryCatch(
    async () => parseFn(response),
    (error) => new ParserError('Could not parse response', error as Error),
  )
}

function handleFailure<E>(
  parseFn: (r: Response) => Promise<E>,
  response: Response,
): TaskEither<StatusError<E> | ParserError, never> {
  const statusError = (body?: E) =>
    new StatusError(response.status, response.statusText, body)

  return pipe(
    tryCatch(
      async () => parseFn(response).then(statusError),
      (error) =>
        new ParserError('Could not parse error response', [
          statusError(),
          error as Error,
        ]),
    ),
    chainW(left),
  )
}

/**
 * Creates a fetch function that returns a lazy `TaskEither` instead of rejecting
 * for network, HTTP status, or response parsing failures.
 *
 * Successful response bodies are parsed as JSON when the content type is JSON,
 * and as text otherwise. `parse` and `parseLeft` can replace these defaults.
 * The fetch implementation can also be supplied for environments without a
 * global Fetch API.
 * The returned function produces a lazy `TaskEither`; calling it with `()`
 * performs the request. The resolved `Either` contains either the parsed body
 * or a typed network, status, or parser error, so it can be composed with
 * `fp-ts` mapping functions without a `try ... catch` around each request.
 *
 * @typeParam E - Parsed error response body type.
 * @typeParam T - Parsed successful response body type.
 * @param options - Optional Fetch API implementation and response parsers.
 * @returns A function that accepts Fetch API input and returns a `TaskEither`.
 * @example
 * ```typescript
 * const binaryFetch = createFetch({ parse: (response) => response.blob() })
 * const result = await binaryFetch('/image.png')()
 * ```
 */
export function createFetch<E, T>(
  options?: Partial<FetchOptions<E, T>>,
): Fetch<E, T> {
  const o: FetchOptions<E | string, T | string> = {
    fetch: window.fetch,
    parse,
    parseLeft,
    ...options,
  }

  return (input, init) =>
    pipe(
      tryCatch(
        async () => o.fetch(input, init),
        (error) => new NetworkError('Network request failed', error as Error),
      ),
      chain((response) =>
        response.ok
          ? handleSuccess(o.parse, response)
          : handleFailure(o.parseLeft, response),
      ),
    )
}

/**
 * Default fetch wrapper using the global Fetch API and JSON/text parsing.
 *
 * @returns A lazy Fetch API wrapper that resolves to an `Either` result.
 * @example
 * ```typescript
 * const result = await ffetch('/api/items')()
 * // result is an Either containing the parsed body or a request error
 * ```
 */
export const ffetch = createFetch()
