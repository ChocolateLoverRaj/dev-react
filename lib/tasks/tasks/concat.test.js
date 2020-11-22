import ConcatTask from './concat.js'
import getFakeTask from '../../../test-lib/tasks/fake-task.js'
import sinon from 'sinon'

test('forwards updates', () => {
  const task1 = getFakeTask()
  const task2 = getFakeTask()
  const concatTask = new ConcatTask(task1, task2)
  expect(typeof task1.emitter._events.update.fn).toBe('function')
  expect(typeof task2.emitter._events.update.fn).toBe('function')
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