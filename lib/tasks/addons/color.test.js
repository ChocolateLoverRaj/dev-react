import ColorAddon from './color.js'
import getFakeAddon from '../../../test-lib/tasks/fake-addon.js'
import sinon from 'sinon'

test('forwards updates', () => {
  const textAddon = getFakeAddon()
  const colorAddon = new ColorAddon(textAddon, 'red')
  expect(typeof textAddon.emitter._events.update.fn).toBe('function')
  const fake = sinon.fake()
  colorAddon.emitter.on('update', fake)
  textAddon.emitter.emit('update')
  expect(fake.calledOnceWith()).toBe(true)
})

test('colors text', () => {
  expect(new ColorAddon(getFakeAddon('text'), 'red').getText()).toBe('\x1B[91m' + 'text' + '\x1B[39m')
})
