import 'whatwg-fetch'
import * as nock from 'nock'
import { ffetch, createFetch } from '../src'
import { left, right } from 'fp-ts/lib/Either'
import { NetworkError, StatusError, ParserError } from '../src/errors'

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
    left(
      new NetworkError('Network request failed', [
        new TypeError('Network request failed')
      ])
    )
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
    left(new StatusError(status, 'Internal Server Error', body))
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
    left(
      new ParserError('Could not parse response', [
        new Error('Unexpected token < in JSON at position 0')
      ])
    )
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
  expect(actual).toEqual(left(new StatusError(status, 'Not Found', body)))
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
  expect(actual).toEqual(left(new StatusError(status, 'Bad Request', body)))
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
  const error = new Error('custom parser error')
  nock(url)
    .get('')
    .reply(status, '')

  const customFetch = createFetch({
    parse: () => Promise.reject(error)
  })

  const actual = await customFetch(url).run()

  expect(actual).toEqual(
    left(new ParserError('Could not parse response', [error]))
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

  expect(actual).toEqual(
    left(new StatusError(status, expect.stringMatching(/I'm a Teapot/i), body))
  )
})

test('custom error parser failure', async () => {
  const status = 418
  const error = new Error('custom error parser failure')
  nock(url)
    .get('')
    .reply(status, '')

  const customFetch = createFetch({
    parseLeft: () => Promise.reject(error)
  })

  const actual = await customFetch(url).run()

  expect(actual).toEqual(
    left(
      new ParserError('Could not parse error response', [
        new StatusError(status, expect.stringMatching(/I'm a Teapot/i)),
        error
      ])
    )
  )
})

test('custom Fetch polyfill', async () => {
  const mockFetch = jest.fn().mockResolvedValue({
    clone: jest.fn().mockReturnThis(),
    headers: {
      get: jest.fn()
    },
    text: jest.fn().mockResolvedValue('')
  })
  const customFetch = createFetch({ fetch: mockFetch })
  await customFetch(url, { method: 'POST ' }).run()
  expect(mockFetch).toHaveBeenCalledWith(url, { method: 'POST ' })
})
