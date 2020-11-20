import CustomTask from './custom.js'
import { _reset as resetAddon } from '../addons/__mocks__/addon.js'
import TextAddon, { _reset as resetTextAddon } from '../addons/__mocks__/text.js'
import EventEmitter, { _reset as resetEventEmitter } from '../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

afterEach(() => {
  resetAddon()
  resetTextAddon()
  resetEventEmitter()
})

test('forwards updates', () => {
  const addon = new TextAddon()
  const task = new CustomTask(addon)
  expect(EventEmitter.prototype.on.calledOnce).toBe(true)
  const fake = sinon.fake()
  task.emitter.on('update', fake)
  addon.emitter.emit('update')
  expect(fake.calledOnce).toBe(true)
})

test('getLines', () => {
  expect(new CustomTask(new TextAddon()).getLines()).toStrictEqual(['text'])
})
