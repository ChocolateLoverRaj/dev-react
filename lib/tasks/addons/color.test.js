import ColorAddon from './color.js'
import TextAddon, { _reset as resetTextAddon } from './__mocks__/text.js'
import chalk, { _reset as resetChalk } from '../../../__mocks__/chalk.js'
import EventEmitter, { _reset as eventEmitterReset } from '../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

afterEach(() => {
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
  new ColorAddon(new TextAddon(), 'red').getText()

  expect(chalk.keyword.calledOnceWith('red')).toBe(true)

  expect(TextAddon.prototype.getText.calledImmediatelyAfter(chalk.keyword)).toBe(true)
  expect(TextAddon.prototype.getText.calledOnceWith()).toBe(true)

  const keywordCall = chalk.keyword.getCall(0).returnValue
  expect(keywordCall.calledImmediatelyAfter(TextAddon.prototype.getText)).toBe(true)
  expect(keywordCall.calledOnceWith()).toBe(true)
})
