import assert from 'assert'
import { test } from '../src/index'

it('reports successful test suites', async () => {
  const t = test('named test suite')

  t('this is a basic test', () => {
    assert.ok(true)
  })

  const report = await t.run()

  assert.deepStrictEqual(report, {
    name: 'named test suite',
    tests: [['this is a basic test', 'ok']],
  })
})

it('reports suites with skipped tests', async () => {
  const t = test('suite with skipped tests')

  t.skip('this is a skipped test', () => {
    assert.ok(true)
  })

  const report = await t.run()

  assert.deepStrictEqual(report, {
    name: 'suite with skipped tests',
    tests: [['this is a skipped test', 'skipped']],
  })
})

it('reports suites with only tests', async () => {
  const t = test('suite with only tests')

  t('this test will be skipped', () => {
    assert.ok(true)
  })

  t.only('only test', () => {
    assert.ok(true)
  })

  t.only('another only test', () => {
    assert.ok(true)
  })

  t('this test will be skipped too', () => {
    assert.ok(true)
  })

  const report = await t.run()

  assert.deepStrictEqual(report, {
    name: 'suite with only tests',
    tests: [
      ['this test will be skipped', 'skipped'],
      ['only test', 'ok'],
      ['another only test', 'ok'],
      ['this test will be skipped too', 'skipped'],
    ],
  })
})

it('reports suites with failed tests', async () => {
  const t = test('suite with failed tests')

  t('this test will fail', () => {
    assert.fail()
  })

  const report = await t.run()

  assert.deepStrictEqual(report, {
    name: 'suite with failed tests',
    tests: [['this test will fail', 'fail']],
  })
})

it('reports rejected promises as failed tests', async () => {
  const t = test('suite with failed async tests')

  t('this async test will fail', async () => {
    return Promise.reject(Error())
  })

  const report = await t.run()

  assert.deepStrictEqual(report, {
    name: 'suite with failed async tests',
    tests: [['this async test will fail', 'fail']],
  })
})
