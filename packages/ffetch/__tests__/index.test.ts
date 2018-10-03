import 'whatwg-fetch'
import * as nock from 'nock'
import { ffetch, createFetch } from '../src'
import { left, right } from 'fp-ts/lib/Either'

const url = 'http://localhost/test'

beforeEach(nock.cleanAll)

test('successful JSON responses', async () => {
  const body = { foo: 'bar' }
  nock(url)
    .get('')
    .reply(200, body, {
      'content-type': 'application/json; charset=utf-8'
    })
  const actual = await ffetch(url).run()
  expect(actual).toEqual(right(body))
})

test('successful plain text responses', async () => {
  const body = '<plain text>'
  nock(url)
    .get('')
    .reply(200, body, {
      'content-type': 'text/plain'
    })
  const actual = await ffetch(url).run()
  expect(actual).toEqual(right(body))
})

test('connection errors', async () => {
  nock(url)
    .get('')
    .replyWithError('')
  const actual = await ffetch(url).run()
  expect(actual).toEqual(
    left({
      type: 'ConnectionError',
      message: 'Network request failed'
    })
  )
})

test('status code errors', async () => {
  const status = 500
  const body = { foo: 'bar' }
  nock(url)
    .get('')
    .reply(status, body, {
      'content-type': 'application/json; charset=utf-8'
    })
  const actual = await ffetch(url).run()
  expect(actual).toEqual(
    left({
      type: 'StatusError',
      message: 'Internal Server Error',
      status,
      body
    })
  )
})

test('invalid response body', async () => {
  const status = 200
  const body = '<not json>'
  nock(url)
    .get('')
    .reply(status, body, {
      'content-type': 'application/json; charset=utf-8'
    })
  const actual = await ffetch(url).run()
  expect(actual).toEqual(
    left({
      type: 'ParserError',
      status,
      message: 'Unexpected token < in JSON at position 0'
    })
  )
})

test('plain text body for status errors', async () => {
  const status = 404
  const body = '<ok>'
  nock(url)
    .get('')
    .reply(status, body, {
      'content-type': 'text/plain'
    })
  const actual = await ffetch(url).run()
  expect(actual).toEqual(
    left({
      type: 'StatusError',
      message: 'Not Found',
      status,
      body
    })
  )
})

test('invalid JSON body for status errors', async () => {
  const status = 400
  const body = '<not json>'
  nock(url)
    .get('')
    .reply(status, body, {
      'content-type': 'application/json; charset=utf-8'
    })
  const actual = await ffetch(url).run()
  expect(actual).toEqual(
    left({
      type: 'StatusError',
      message: 'Bad Request',
      status,
      body
    })
  )
})

test('custom body parser success', async () => {
  const status = 201
  const expected = `Received a response with status code ${status}.`
  nock(url)
    .get('')
    .reply(status, '')

  const customFetch = createFetch({
    parse: () => Promise.resolve(expected)
  })

  const actual = await customFetch(url).run()

  expect(actual).toEqual(right(expected))
})

test('custom parser error', async () => {
  const status = 200
  const message = `custom parser error`
  nock(url)
    .get('')
    .reply(status, '')

  const customFetch = createFetch({
    parse: () => Promise.reject(new Error(message))
  })

  const actual = await customFetch(url).run()

  expect(actual).toEqual(
    left({
      type: 'ParserError',
      status,
      message
    })
  )
})

test('custom error parser success', async () => {
  const status = 418
  const body = `Received a response with status code ${status}.`
  nock(url)
    .get('')
    .reply(status, '')

  const customFetch = createFetch({
    parseLeft: () => Promise.resolve(body)
  })

  const actual = await customFetch(url).run()

  expect(actual).toMatchObject(
    left({
      type: 'StatusError',
      body
    })
  )
})

test('custom error parser failure', async () => {
  const status = 418
  const message = 'custom error parser failure'
  nock(url)
    .get('')
    .reply(status, '')

  const customFetch = createFetch({
    parseLeft: () => Promise.reject(new Error(message))
  })

  const actual = await customFetch(url).run()

  expect(actual).toMatchObject(
    left({
      type: 'ParserError',
      status,
      message
    })
  )
})

test('custom Fetch polyfill', async () => {
  const mockFetch = jest.fn().mockResolvedValue({
    clone: jest.fn().mockReturnThis(),
    headers: {
      get: jest.fn()
    },
    text: jest.fn().mockResolvedValue(null)
  })
  const customFetch = createFetch({ fetch: mockFetch })
  await customFetch(url, { method: 'POST ' }).run()
  expect(mockFetch).toHaveBeenCalledWith(url, { method: 'POST ' })
})
