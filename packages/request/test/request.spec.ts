import 'whatwg-fetch'
import nock from 'nock'
import { pipe } from '@pacote/pipe'
import {
  GET,
  POST,
  PUT,
  DELETE,
  HEAD,
  CONNECT,
  OPTIONS,
  TRACE,
  PATCH,
  header,
  query,
  body,
  send,
} from '../src/index'

afterEach(nock.cleanAll)

const TEST_URL = 'http://localhost'

test.each([
  ['GET', GET],
  ['POST', POST],
  ['PUT', PUT],
  ['DELETE', DELETE],
  ['HEAD', HEAD],
  ['CONNECT', CONNECT],
  ['OPTIONS', OPTIONS],
  ['TRACE', TRACE],
  ['PATCH', PATCH],
])('%s request creator', (method, requestFn) => {
  const req = requestFn(TEST_URL)
  expect(req).toEqual({ url: TEST_URL, method, headers: [] })
})

describe('header()', () => {
  it('adds a header to a request', () => {
    const req = pipe(GET(TEST_URL), header('x-header', 'test'))
    expect(req.headers).toEqual([['x-header', 'test']])
  })

  it('adds multiple headers with the same name to a request', () => {
    const req = pipe(
      GET(TEST_URL),
      header('x-header', 'test-1'),
      header('x-header', 'test-2')
    )
    expect(req.headers).toEqual([
      ['x-header', 'test-1'],
      ['x-header', 'test-2'],
    ])
  })
})

describe('query()', () => {
  it('add a query string parameter', () => {
    const req = pipe(GET(TEST_URL), query('param', 'test'))
    expect(req.url).toEqual(TEST_URL + '?param=test')
  })

  it('overwrite query string parameters with the same name', () => {
    const req = pipe(
      GET(TEST_URL),
      query('param', 'overwritten'),
      query('param', 'test')
    )
    expect(req.url).toEqual(TEST_URL + '?param=test')
  })

  it('set an array query string parameter', () => {
    const req = pipe(GET(TEST_URL), query('array', [1, 2, 3]))
    expect(req.url).toEqual(TEST_URL + '?array=1&array=2&array=3')
  })
})

describe('body()', () => {
  it('set plain text request body', () => {
    const data = 'plain text'
    const req = pipe(POST(TEST_URL), body(data))
    expect(req.body).toEqual(data)
  })
})

test('send() sends a request using the Fetch API', async () => {
  const scope = nock(TEST_URL, {
    reqheaders: {
      'x-header': 'test',
    },
  })
    .post('/', 'body')
    .reply(200)

  await pipe(POST(TEST_URL), header('x-header', 'test'), body('body'), send())

  expect(scope.isDone()).toEqual(true)
})

test('send() sends a request using a Fetch-compatible function', async () => {
  const fakeFetch = jest.fn().mockResolvedValue({})

  await pipe(
    POST(TEST_URL),
    header('x-header', 'test'),
    body('body'),
    send(fakeFetch)
  )

  expect(fakeFetch).toHaveBeenCalledWith(TEST_URL, {
    method: 'POST',
    body: 'body',
    headers: new Headers({ 'x-header': 'test' }),
  })
})
