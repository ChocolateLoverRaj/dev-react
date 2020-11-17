import Addon, { _reset as resetAddon } from './addon.js'
import EventEmitter, { _reset as resetEventEmitter } from '../../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

afterEach(() => {
  resetAddon()
  resetEventEmitter()
})

test('update', () => {
  const fake = sinon.fake()
  const addon = new Addon()
  addon.emitter.on('update', fake)
  addon.update()
  expect(EventEmitter.prototype.on.calledOnceWith()).toBe(true)
})

test('getText', () => {
  const addon = new Addon()
  const arg = Symbol()
  expect(addon.getText(arg)).toBe('')
  expect(Addon.prototype.getText.calledOnceWith(arg)).toBe(true)
})

test('_reset', () => {
  const addon = new Addon()
  addon.update()
  addon.getText()
  resetAddon()
  expect(Addon.prototype.update.notCalled).toBe(true)
  expect(Addon.prototype.getText.notCalled).toBe(true)
})
