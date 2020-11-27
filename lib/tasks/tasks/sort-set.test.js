/* global test, expect */

import SortSetTask from './sort-set.js'
import SetTask from './set.js'
import getFakeTask from '../../../test-lib/tasks/fake-task.js'
import sinon from 'sinon'

test('forwards updates', () => {
  const setTask = new SetTask()
  const sortSetTask = new SortSetTask(setTask)
  expect(typeof setTask.emitter._events.update.fn).toBe('function')
  const fake = sinon.fake()
  sortSetTask.emitter.on('update', fake)
  setTask.emitter.emit('update')
  expect(fake.calledOnce).toBe(true)
})

test('getLines', () => {
  const task1 = getFakeTask(['first'])
  task1.id = 1
  const task2 = getFakeTask(['second'])
  task2.id = 2
  const setTask = new SetTask(task2, task1)
  const sortSetTask = new SortSetTask(setTask, (a, b) => a.id - b.id)
  expect(sortSetTask.getLines()).toStrictEqual(['first', 'second'])
})
