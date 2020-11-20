import CustomTask from './custom.js'
import getFakeAddon from '../../../test-lib/tasks/fake-addon.js'
import EventEmitter, { _reset as resetEventEmitter } from '../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

afterEach(resetEventEmitter)

test('forwards updates', () => {
  const addon = getFakeAddon()
  const task = new CustomTask(addon)
  expect(EventEmitter.prototype.on.calledOnce).toBe(true)
  const fake = sinon.fake()
  task.emitter.on('update', fake)
  addon.emitter.emit('update')
  expect(fake.calledOnce).toBe(true)
})

test('getLines', () => {
  expect(new CustomTask(getFakeAddon('text')).getLines()).toStrictEqual(['text'])
})
