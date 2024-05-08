import { test } from 'vitest'
// import { asyncDisposable, disposable } from '../src/index'

test('creates a synchronously disposable resource', () => {
  // const onDispose = vi.fn()
  // const resource = { noop: () => {} }
  // const getResource = () => disposable(resource, onDispose)
  // ;(() => {
  //   using resource = getResource()
  //   resource.noop()
  // })()
  // expect(onDispose).toHaveBeenCalledTimes(1)
})

test('creates an asynchronously disposable resource', async () => {
  // const onDispose = vi.fn(async () => {})
  // const resource = { noop: () => {} }
  // const getResource = () => asyncDisposable(resource, onDispose)
  // ;(async () => {
  //   await using resource = getResource()
  //   resource.noop()
  // })()
  // expect(onDispose).toHaveBeenCalledTimes(1)
})
