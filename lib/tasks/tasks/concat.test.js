import ConcatTask from './concat.js'
import getFakeTask from '../../../test-lib/tasks/fake-task.js'
import EventEmitter, { _reset as resetEventEmitter } from '../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

afterEach(resetEventEmitter)

test('forwards updates', () => {
  const task1 = getFakeTask()
  const task2 = getFakeTask()
  const concatTask = new ConcatTask(task1, task2)
  expect(EventEmitter.prototype.on.calledTwice).toBe(true)
  const fake = sinon.fake()
  concatTask.emitter.on('update', fake)
  task1.emitter.emit('update')
  task2.emitter.emit('update')
  expect(fake.calledTwice).toBe(true)
})

test('concat', () => {
  const task1 = getFakeTask(['a', 'b'])
  const task2 = getFakeTask(['c', 'd'])
  expect(new ConcatTask(task1, task2).getLines()).toStrictEqual(['a', 'b', 'c', 'd'])
  expect(task1.getLines.calledOnceWith()).toBe(true)
  expect(task2.getLines.calledOnceWith()).toBe(true)
})