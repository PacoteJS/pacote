import { asyncDisposable, disposable } from '../src/index'

test.skip('creates a synchronously disposable resource', () => {
  const onDispose = jest.fn()
  const resource = { noop: () => {} }
  const getResource = () => disposable(resource, onDispose)

  ;(() => {
    using resource = getResource()
    resource.noop()
  })()

  expect(onDispose).toHaveBeenCalledTimes(1)
})

test.skip('creates an asynchronously disposable resource', async () => {
  const onDispose = jest.fn(async () => {})
  const resource = { noop: () => {} }
  const getResource = () => asyncDisposable(resource, onDispose)

  ;(async () => {
    await using resource = getResource()
    resource.noop()
  })()

  expect(onDispose).toHaveBeenCalledTimes(1)
})
