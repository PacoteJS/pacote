import { assert, anything, asyncProperty, func } from 'fast-check'
import { describe, expect, test } from 'vitest'
import { Task, flatMap, flatten, map } from '../src/index'

test('run a task', async () => {
  const task = Task('ok')
  await expect(task()).resolves.toBe('ok')
})

test('map a task', async () => {
  const task = map((a: string) => 1, Task('ok'))
  await expect(task()).resolves.toBe(1)
})

test('flatmap a task', async () => {
  const task = flatMap((a: string) => Task(1), Task('ok'))
  await expect(task()).resolves.toBe(1)
})

test('flatten a task', async () => {
  const task = flatten(Task(Task('ok')))
  await expect(task()).resolves.toBe('ok')
})

describe('monad laws', () => {
  test('left identity', async () => {
    await assert(
      asyncProperty(func(anything()), anything(), async (fn, value) => {
        const bound = flatMap((x) => Task(fn(x)), Task(value))
        const direct = Task(fn(value))

        expect(await bound()).toEqual(await direct())
      }),
    )
  })

  test('right identity', async () => {
    await assert(
      asyncProperty(anything(), async (value) => {
        const bound = flatMap(Task, Task<unknown>(value))
        const direct = Task(value)

        expect(await bound()).toEqual(await direct())
      }),
    )
  })

  test('associativity', async () => {
    await assert(
      asyncProperty(
        func(anything()),
        func(anything()),
        anything(),
        async (f, g, value) => {
          const ft = (x: unknown) => Task(f(x))
          const gt = (x: unknown) => Task(g(x))
          const t = Task(value)

          const left = flatMap(gt, flatMap(ft, t))
          const right = flatMap((x) => flatMap(gt, ft(x)), t)

          expect(await left()).toEqual(await right())
        },
      ),
    )
  })
})
