import ColorAddon from './color.js'
import getFakeAddon from '../../../test-lib/tasks/fake-addon.js'
import EventEmitter, { _reset as eventEmitterReset } from '../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

afterEach(eventEmitterReset)

test('forwards updates', () => {
  const textAddon = getFakeAddon()
  const colorAddon = new ColorAddon(textAddon, 'red')
  expect(EventEmitter.prototype.on.calledOnce).toBe(true)
  const fake = sinon.fake()
  colorAddon.emitter.on('update', fake)
  textAddon.emitter.emit('update')
  expect(fake.calledOnceWith()).toBe(true)
})

test('colors text', () => {
  expect(new ColorAddon(getFakeAddon('text'), 'red').getText()).toBe('\x1B[91m' + 'text' + '\x1B[39m')
})
