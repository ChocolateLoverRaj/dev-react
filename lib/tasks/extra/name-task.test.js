/* global describe, test, expect */

import NameTask from './name-task.js'
import getFakeTask from '../../../test-lib/tasks/fake-task.js'
import sinon from 'sinon'

describe('constructor', () => {
  test('name', () => {
    const name = 'Dave'
    const task = new NameTask(name, getFakeTask())
    expect(task.name).toBe(name)
  })

  test('forwards updates', () => {
    const task = getFakeTask()
    const nameTask = new NameTask('Bob', task)
    expect(typeof task.emitter._events.update.fn).toBe('function')
    const fake = sinon.fake()
    nameTask.emitter.on('update', fake)
    task.emitter.emit('update')
    expect(fake.calledOnce).toBe(true)
  })
})

test('getLines', () => {
  const task = getFakeTask(['some', 'lines'])
  const nameTask = new NameTask('Bob', task)
  expect(nameTask.getLines()).toStrictEqual(['some', 'lines'])
})
