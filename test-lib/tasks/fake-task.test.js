import getFakeTask from './fake-task.js'
import EventEmitter from 'eventemitter3'

test('getLines', () => {
  const lines = ['a', 'b']
  expect(getFakeTask(lines).getLines()).toStrictEqual(lines)
})

test('emitter', () => {
  expect(getFakeTask().emitter).toBeInstanceOf(EventEmitter)
})
