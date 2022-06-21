import 'whatwg-fetch'
import matchers from '@pacote/jest-either'
import { ffetch, createFetch } from '../src'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { NetworkError, StatusError, ParserError } from '../src/errors'

expect.extend(matchers)

const url = 'http://localhost'

const server = setupServer()

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

test('successful JSON responses', async () => {
  const body = { foo: 'bar' }
  server.use(rest.get('/', (_, res, ctx) => res(ctx.json(body))))
  const actual = await ffetch(url)()
  expect(actual).toEqualRight(body)
})

test('successful plain text responses', async () => {
  const body = '<plain text>'
  server.use(rest.get('/', (_, res, ctx) => res(ctx.text(body))))
  const actual = await ffetch(url)()
  expect(actual).toEqualRight(body)
})

test('connection errors', async () => {
  server.use(rest.get('/', (_, res) => res.networkError('')))
  const actual = await ffetch(url)()
  expect(actual).toEqualLeft(
    new NetworkError('Network request failed', [
      new TypeError('Network request failed'),
    ])
  )
})

test('status code errors', async () => {
  const status = 500
  const body = { foo: 'bar' }
  server.use(
    rest.get('/', (_, res, ctx) => res(ctx.status(status), ctx.json(body)))
  )
  const actual = await ffetch(url)()
  expect(actual).toEqualLeft(
    new StatusError(status, 'Internal Server Error', body)
  )
})

test('invalid response body', async () => {
  server.use(
    rest.get('/', (_, res, ctx) =>
      res(
        ctx.set('content-type', 'application/json; charset=utf-8'),
        ctx.body('<not json>')
      )
    )
  )
  const actual = await ffetch(url)()
  expect(actual).toEqualLeft(
    new ParserError('Could not parse response', [
      new Error('Unexpected token < in JSON at position 0'),
    ])
  )
})

test('plain text body for status errors', async () => {
  const status = 404
  const body = '<ok>'
  server.use(
    rest.get('/', (_, res, ctx) => res(ctx.status(status), ctx.text(body)))
  )
  const actual = await ffetch(url)()
  expect(actual).toEqualLeft(new StatusError(status, 'Not Found', body))
})

test('invalid JSON body for status errors', async () => {
  const status = 400
  const body = '<not json>'
  server.use(
    rest.get('/', (_, res, ctx) =>
      res(
        ctx.status(status),
        ctx.set('content-type', 'application/json; charset=utf-8'),
        ctx.body(body)
      )
    )
  )
  const actual = await ffetch(url)()
  expect(actual).toEqualLeft(new StatusError(status, 'Bad Request', body))
})

test('custom body parser success', async () => {
  const status = 201
  const expected = `Received a response with status code ${status}.`
  server.use(rest.get('/', (_, res, ctx) => res(ctx.status(status))))
  const customFetch = createFetch({
    parse: async () => Promise.resolve(expected),
  })

  const actual = await customFetch(url)()

  expect(actual).toEqualRight(expected)
})

test('custom parser error', async () => {
  const error = new Error('custom parser error')
  server.use(rest.get('/', (_, res) => res()))
  const customFetch = createFetch({
    parse: async () => Promise.reject(error),
  })

  const actual = await customFetch(url)()

  expect(actual).toEqualLeft(
    new ParserError('Could not parse response', [error])
  )
})

test('custom error parser success', async () => {
  const status = 500
  const body = `Received a response with status code ${status}.`
  server.use(
    rest.get('/', (_, res, ctx) => res(ctx.status(status), ctx.text(body)))
  )
  const customFetch = createFetch({
    parseLeft: async () => Promise.resolve(body),
  })

  const actual = await customFetch(url)()

  expect(actual).toEqualLeft(
    new StatusError(status, 'Internal Server Error', body)
  )
})

test('custom error parser failure', async () => {
  const status = 500
  const error = new Error('custom error parser failure')
  server.use(rest.get('/', (_, res, ctx) => res(ctx.status(status))))
  const customFetch = createFetch({
    parseLeft: async () => Promise.reject(error),
  })

  const actual = await customFetch(url)()

  expect(actual).toEqualLeft(
    new ParserError('Could not parse error response', [
      new StatusError(status, 'Internal Server Error'),
      error,
    ])
  )
})

test('custom Fetch polyfill', async () => {
  const mockFetch = jest.fn().mockResolvedValue({
    clone: jest.fn().mockReturnThis(),
    headers: {
      get: jest.fn(),
    },
    text: jest.fn().mockResolvedValue(''),
  })
  const customFetch = createFetch({ fetch: mockFetch })
  await customFetch(url, { method: 'POST ' })()
  expect(mockFetch).toHaveBeenCalledWith(url, { method: 'POST ' })
})
