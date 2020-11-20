import ColorAddon from './color.js'
import { _reset as resetAddon } from './__mocks__/addon.js'
import TextAddon, { _reset as resetTextAddon } from './__mocks__/text.js'
import chalk, { _reset as resetChalk } from '../../../__mocks__/chalk.js'
import EventEmitter, { _reset as eventEmitterReset } from '../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

afterEach(() => {
  resetAddon()
  resetTextAddon()
  resetChalk()
  eventEmitterReset()
})

test('forwards updates', () => {
  const textAddon = new TextAddon()
  const colorAddon = new ColorAddon(textAddon, 'red')
  expect(EventEmitter.prototype.on.calledOnce).toBe(true)
  const fake = sinon.fake()
  colorAddon.emitter.on('update', fake)
  textAddon.emitter.emit('update')
  expect(fake.calledOnceWith()).toBe(true)
})

test('colors text', () => {
  expect(new ColorAddon(new TextAddon(), 'red').getText()).toBe('\x1B[91m' + 'text' + '\x1B[39m')
  expect(chalk.keyword.calledOnceWith('red')).toBe(true)
  expect(TextAddon.prototype.getText.calledOnceWith()).toBe(true)
  expect(chalk.keyword.getCall(0).returnValue.calledOnceWith('text')).toBe(true)
})
