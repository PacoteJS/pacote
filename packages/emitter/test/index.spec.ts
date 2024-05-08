import { test, expect, vi } from 'vitest'
import { createEmitter } from '../src'

test(`event subscription`, () => {
  const emitter = createEmitter()
  const callback = vi.fn()

  emitter.on('test', callback)
  emitter.emit('test')

  expect(callback).toHaveBeenCalledTimes(1)
})

test(`multiple event subscribers`, () => {
  type TestEvents = {
    test: () => void
  }

  const emitter = createEmitter<TestEvents>()
  const callback1 = vi.fn()
  const callback2 = vi.fn()

  emitter.on('test', callback1)
  emitter.on('test', callback2)
  emitter.emit('test')

  expect(callback1).toHaveBeenCalledTimes(1)
  expect(callback1).toHaveBeenCalledTimes(1)
})

test(`unsubscribing from an event`, () => {
  type TestEvents = {
    test: () => void
  }

  const emitter = createEmitter<TestEvents>()
  const callback = vi.fn()

  const unsubcribe = emitter.on('test', callback)
  unsubcribe()
  emitter.emit('test')

  expect(callback).toHaveBeenCalledTimes(0)
})

test(`passing event parameters`, () => {
  type TestEvents = {
    test: (a: string, b: number) => void
  }

  const emitter = createEmitter<TestEvents>()
  const callback = vi.fn()

  emitter.on('test', callback)
  emitter.emit('test', 'ok', 0)

  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledWith('ok', 0)
})

test(`no errors emitting unsubscribed events`, () => {
  const emitter = createEmitter()
  expect(() => emitter.emit('test')).not.toThrow()
})
