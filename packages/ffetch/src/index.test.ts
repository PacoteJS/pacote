import * as nock from 'nock'
import { ffetch } from '.'
import { left, right } from 'fp-ts/lib/Either'

const URL = 'http://localhost/test'

beforeEach(nock.cleanAll)

test('successful JSON responses', async () => {
  const body = { foo: 'bar' }
  nock(URL)
    .get('')
    .reply(200, body, {
      'content-type': 'application/json; charset=utf-8'
    })
  const actual = await ffetch(URL).run()
  expect(actual).toEqual(right(body))
})

test('successful plain text responses', async () => {
  const body = '<plain text>'
  nock(URL)
    .get('')
    .reply(200, body, {
      'content-type': 'text/plain'
    })
  const actual = await ffetch(URL).run()
  expect(actual).toEqual(right(body))
})

test('connection errors', async () => {
  const message = 'message'
  nock(URL)
    .get('')
    .replyWithError(message)
  const actual = await ffetch(URL).run()
  expect(actual).toEqual(
    left({
      type: 'ConnectionError',
      message: expect.stringContaining(message)
    })
  )
})

test('status code errors', async () => {
  const status = 500
  const body = { foo: 'bar' }
  nock(URL)
    .get('')
    .reply(status, body, {
      'content-type': 'application/json; charset=utf-8'
    })
  const actual = await ffetch(URL).run()
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
  nock(URL)
    .get('')
    .reply(status, body, {
      'content-type': 'application/json; charset=utf-8'
    })
  const actual = await ffetch(URL).run()
  expect(actual).toEqual(
    left({
      type: 'ParserError',
      status,
      message: expect.stringContaining('invalid json response body')
    })
  )
})

test('plain text body for status errors', async () => {
  const status = 404
  const body = '<ok>'
  nock(URL)
    .get('')
    .reply(status, body, {
      'content-type': 'text/plain'
    })
  const actual = await ffetch(URL).run()
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
  nock(URL)
    .get('')
    .reply(status, body, {
      'content-type': 'application/json; charset=utf-8'
    })
  const actual = await ffetch(URL).run()
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
  nock(URL)
    .get('')
    .reply(status, '')
  const actual = await ffetch(
    URL,
    {},
    {
      parse: () => Promise.resolve(expected)
    }
  ).run()
  expect(actual).toEqual(right(expected))
})

test('custom parser error', async () => {
  const status = 200
  const message = `custom parser error`
  nock(URL)
    .get('')
    .reply(status, '')

  const actual = await ffetch(
    URL,
    {},
    {
      parse: () => Promise.reject(new Error(message))
    }
  ).run()

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
  nock(URL)
    .get('')
    .reply(status, '')
  const actual = await ffetch(
    URL,
    {},
    {
      parseLeft: () => Promise.resolve(body)
    }
  ).run()
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
  nock(URL)
    .get('')
    .reply(status, '')
  const actual = await ffetch(
    URL,
    {},
    {
      parseLeft: () => Promise.reject(new Error(message))
    }
  ).run()
  expect(actual).toMatchObject(
    left({
      type: 'ParserError',
      status,
      message
    })
  )
})
