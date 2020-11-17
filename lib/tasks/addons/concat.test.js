import ConcatAddon from './concat.js'
import Addon from './__mocks__/addon.js'
import TextAddon, { _reset as resetTextAddon } from './__mocks__/text.js'
import EventEmitter, { _reset as resetEventEmitter } from '../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

afterEach(() => {
  resetTextAddon()
  resetEventEmitter()
})

test('forwards updates', () => {
  const addon1 = new Addon()
  const addon2 = new Addon()
  const concatAddon = new ConcatAddon(addon1, addon2)
  expect(EventEmitter.prototype.on.calledTwice).toBe(true)
  const fake = sinon.fake()
  concatAddon.emitter.on('update', fake)
  addon1.emitter.emit('update')
  addon2.emitter.emit('update')
  expect(fake.calledTwice).toBe(true)
})

test('getText', () => {
  const addon1 = new TextAddon('a')
  const addon2 = new TextAddon('b')
  const concatAddon = new ConcatAddon(addon1, addon2)
  expect(concatAddon.getText()).toBe('ab')
  expect(TextAddon.prototype.getText.calledTwice).toBe(true)
})
