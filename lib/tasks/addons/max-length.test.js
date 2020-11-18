import MaxLengthAddon from './max-length.js'
import Addon from './__mocks__/addon.js'
import TextAddon, { _reset as resetTextAddon } from './__mocks__/text.js'
import EventEmitter, { _reset as resetEventEmitter } from '../../../__mocks__/eventemitter3.js'
import sliceAnsi, { _reset as resetSliceAnsi } from '../../../__mocks__/slice-ansi.js'
import sinon from 'sinon'

afterEach(() => {
  resetTextAddon()
  resetEventEmitter()
  resetSliceAnsi()
})

test('forwards updates', () => {
  const addon = new Addon()
  const maxLengthAddon = new MaxLengthAddon(addon, 0)
  expect(EventEmitter.prototype.on.calledOnce).toBe(true)
  const fake = sinon.fake()
  maxLengthAddon.emitter.on('update', fake)
  addon.emitter.emit('update')
  expect(fake.calledOnce).toBe(true)
})

test('getText', () => {
  const textAddon = new TextAddon('')
  const maxLengthAddon = new MaxLengthAddon(textAddon, 0)
  maxLengthAddon.getText()
  expect(TextAddon.prototype.getText.calledOnceWith()).toBe(true)
  expect(sliceAnsi.calledImmediatelyAfter(TextAddon.prototype.getText)).toBe(true)
  expect(sliceAnsi.calledOnceWith('', 0, 0)).toBe(true)
})
