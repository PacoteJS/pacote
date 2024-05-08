/**
 * @vitest-environment jsdom
 */

import { beforeAll, afterEach, afterAll, test, expect, vi } from 'vitest'
import matchers from '@pacote/jest-either'
import { createFetch } from '../src'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { NetworkError, StatusError, ParserError } from '../src/errors'

expect.extend(matchers)

const handlers = [
  http.get('/json', () => HttpResponse.json({ json: true })),
  http.get('/text', () => HttpResponse.text('<plain text>')),
  http.get('/text-error', () =>
    HttpResponse.text('<not found>', { status: 404 }),
  ),
  http.get('/json-error', () =>
    HttpResponse.json({ json: true }, { status: 500 }),
  ),
  http.get(
    '/bad-content',
    () =>
      new HttpResponse('<not json>', {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }),
  ),
  http.get(
    '/bad-content-error',
    () =>
      new HttpResponse('<not json>', {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        status: 400,
      }),
  ),
]

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

test('successful JSON responses', async () => {
  const ffetch = createFetch()
  const actual = await ffetch('/json')()
  expect(actual).toEqualRight({ json: true })
})

test('successful plain text responses', async () => {
  const ffetch = createFetch()
  const actual = await ffetch('/text')()
  expect(actual).toEqualRight('<plain text>')
})

test('connection errors', async () => {
  const ffetch = createFetch()
  const actual = await ffetch('')()
  expect(actual).toEqualLeft(
    new NetworkError('Network request failed', [
      new TypeError('Network request failed'),
    ]),
  )
})

test('status code errors', async () => {
  const ffetch = createFetch()
  const actual = await ffetch('/json-error')()
  expect(actual).toEqualLeft(
    new StatusError(500, 'Internal Server Error', { json: true }),
  )
})

test('invalid response body', async () => {
  const ffetch = createFetch()
  const actual = await ffetch('/bad-content')()
  expect(actual).toEqualLeft(
    new ParserError('Could not parse response', [
      new Error('Unexpected token < in JSON at position 0'),
    ]),
  )
})

test('plain text body for status errors', async () => {
  const ffetch = createFetch()
  const actual = await ffetch('/text-error')()
  expect(actual).toEqualLeft(new StatusError(404, 'Not Found', '<not found>'))
})

test('invalid JSON body for status errors', async () => {
  const ffetch = createFetch()
  const actual = await ffetch('/bad-content-error')()
  expect(actual).toEqualLeft(new StatusError(400, 'Bad Request', '<not json>'))
})

test('custom body parser success', async () => {
  const expected = 'Received a response with status code 200.'
  const customFetch = createFetch({
    parse: async () => Promise.resolve(expected),
  })

  const actual = await customFetch('/json')()

  expect(actual).toEqualRight(expected)
})

test('custom parser error', async () => {
  const error = new Error('custom parser error')
  const customFetch = createFetch({
    parse: async () => Promise.reject(error),
  })

  const actual = await customFetch('/text')()

  expect(actual).toEqualLeft(
    new ParserError('Could not parse response', [error]),
  )
})

test('custom error parser success', async () => {
  const body = 'Received a response with status code 404.'
  const customFetch = createFetch({
    parseLeft: async () => Promise.resolve(body),
  })

  const actual = await customFetch('/text-error')()

  expect(actual).toEqualLeft(new StatusError(404, 'Not Found', body))
})

test('custom error parser failure', async () => {
  const error = new Error('custom error parser failure')
  const customFetch = createFetch({
    parseLeft: async () => Promise.reject(error),
  })

  const actual = await customFetch('/text-error')()

  expect(actual).toEqualLeft(
    new ParserError('Could not parse error response', [
      new StatusError(404, 'Not Found'),
      error,
    ]),
  )
})

test('custom Fetch polyfill', async () => {
  const mockFetch = vi.fn().mockResolvedValue({
    clone: vi.fn().mockReturnThis(),
    headers: {
      get: vi.fn(),
    },
    text: vi.fn().mockResolvedValue(''),
  })
  const customFetch = createFetch({ fetch: mockFetch })
  await customFetch('/', { method: 'POST ' })()
  expect(mockFetch).toHaveBeenCalledWith('/', {
    method: 'POST ',
  })
})
