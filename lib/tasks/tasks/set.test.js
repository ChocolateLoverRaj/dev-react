/* global test, expect, describe */

import SetTask from './set.js'
import getFakeTask from '../../../test-lib/tasks/fake-task.js'
import sinon from 'sinon'

test('constructor', () => {
  const task1 = getFakeTask()
  const task2 = getFakeTask()
  const task = new SetTask(task1, task2)
  expect(task.tasks.has(task1)).toBe(true)
  expect(task.tasks.has(task2)).toBe(true)
  expect(task.tasks.size).toBe(2)
  expect(task1.emitter._events.update.fn).toBe(task.updateHandler)
  expect(task2.emitter._events.update.fn).toBe(task.updateHandler)
  const fake = sinon.fake()
  task.emitter.on('update', fake)
  task.updateHandler()
  expect(fake.calledOnceWith()).toBe(true)
})

test('getLines', () => {
  expect(new SetTask(
    getFakeTask(['a', 'b']),
    getFakeTask(['c', 'd'])
  ).getLines()).toStrictEqual(['a', 'b', 'c', 'd'])
})

test('add', () => {
  const setTask = new SetTask()
  const fakeTask = getFakeTask()
  setTask.add(fakeTask)
  expect(setTask.tasks.has(fakeTask)).toBe(true)
  expect(setTask.tasks.size).toBe(1)
  expect(fakeTask.emitter._events.update.fn).toBe(setTask.updateHandler)
})

describe('delete', () => {
  test('not key', () => {
    new SetTask().delete('not a key')
  })

  test('key', () => {
    const fakeTask = getFakeTask()
    const setTask = new SetTask(fakeTask)
    setTask.delete(fakeTask)
    expect(setTask.tasks.size).toBe(0)
  })
})

test('iterable', () => {
  const task1 = getFakeTask()
  const task2 = getFakeTask()
  const setTask = new SetTask(task1, task2)
  expect([...setTask]).toStrictEqual([task1, task2])
})
