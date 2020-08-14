import assert from 'assert'
import { test } from '../src/index.js'

const testNamed = test('named test suite')

testNamed('this is a basic test', () => {
  assert.ok(true)
})

const reportNamed = await testNamed.run()

assert.deepStrictEqual(
  reportNamed,
  {
    name: 'named test suite',
    tests: [['this is a basic test', 'ok']],
  },
  'handles named tests'
)

const testSkipped = test('suite with skipped tests')

testSkipped.skip('this is a skipped test', () => {
  assert.ok(true)
})

const reportSkipped = await testSkipped.run()

assert.deepStrictEqual(
  reportSkipped,
  {
    name: 'suite with skipped tests',
    tests: [['this is a skipped test', 'skipped']],
  },
  'handles skipped tests'
)

const testOnly = test('suite with only tests')

testOnly('this test will be skipped', () => {
  assert.ok(true)
})

testOnly.only('only test', () => {
  assert.ok(true)
})

testOnly.only('another only test', () => {
  assert.ok(true)
})

testOnly('this test will be skipped too', () => {
  assert.ok(true)
})

const reportOnly = await testOnly.run()

assert.deepStrictEqual(
  reportOnly,
  {
    name: 'suite with only tests',
    tests: [
      ['this test will be skipped', 'skipped'],
      ['only test', 'ok'],
      ['another only test', 'ok'],
      ['this test will be skipped too', 'skipped'],
    ],
  },
  'handles only tests'
)

const testFailed = test('suite with failed tests')

testFailed('this test will fail', () => {
  assert.fail()
})

const reportFailed = await testFailed.run()

assert.deepStrictEqual(
  reportFailed,
  {
    name: 'suite with failed tests',
    tests: [['this test will fail', 'fail']],
  },
  'handles failed tests'
)

const testFailedAsync = test('suite with failed async tests')

testFailedAsync('this async test will fail', async () => {
  return Promise.reject(Error())
})

const reportFailedAsync = await testFailedAsync.run()

assert.deepStrictEqual(
  reportFailedAsync,
  {
    name: 'suite with failed async tests',
    tests: [['this async test will fail', 'fail']],
  },
  'handles failed async tests'
)
