/* eslint-disable testing-library/await-async-utils */
import 'whatwg-fetch'
import nock from 'nock'
import { pipe } from '@pacote/pipe'
import { Ok } from '@pacote/result'
import {
  GET,
  send,
  status,
  waitFor,
  statusText,
  header,
  json,
  text,
} from '../src/index'
import { Some } from '@pacote/option'

afterEach(nock.cleanAll)

const TEST_URL = 'http://localhost'

test('status() retrieves the response status', async () => {
  nock(TEST_URL).get('/').reply(200)
  const result = await pipe(GET(TEST_URL), send(), waitFor(status))
  expect(result).toEqual(Ok(200))
})

test('statusText() retrieves the response status text', async () => {
  nock(TEST_URL).get('/').reply(200)
  const result = await pipe(GET(TEST_URL), send(), waitFor(statusText))
  expect(result).toEqual(Ok('OK'))
})

test('header() retrieves a response header', async () => {
  nock(TEST_URL).get('/').reply(200, '', { 'X-Test': 'Success' })
  const result = await pipe(GET(TEST_URL), send(), waitFor(header('X-Test')))
  expect(result).toEqual(Ok(Some('Success')))
})

test('json() returns a JSON response result', async () => {
  nock(TEST_URL).get('/').reply(200, { foo: 'bar' })
  const result = await pipe(GET(TEST_URL), send(), waitFor(json))
  expect(result).toEqual(Ok({ foo: 'bar' }))
})

test('text() returns a text response result', async () => {
  nock(TEST_URL).get('/').reply(200, 'test')
  const result = await pipe(GET(TEST_URL), send(), waitFor(text))
  expect(result).toEqual(Ok('test'))
})

test.todo('formData()')
test.todo('stream()')
test.todo('arrayBuffer()')
test.todo('blob()')
