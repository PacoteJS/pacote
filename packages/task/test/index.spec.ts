import { expect, test } from 'vitest'
import { Task, flatten, flatMap, map } from '../src/index'

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
