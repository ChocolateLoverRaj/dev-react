import ConcatAddon from './concat.js'
import getFakeAddon from '../../../test-lib/tasks/fake-addon.js'
import EventEmitter, { _reset as resetEventEmitter } from '../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

afterEach(resetEventEmitter)

test('forwards updates', () => {
  const addon1 = getFakeAddon()
  const addon2 = getFakeAddon()
  const concatAddon = new ConcatAddon(addon1, addon2)
  expect(EventEmitter.prototype.on.calledTwice).toBe(true)
  const fake = sinon.fake()
  concatAddon.emitter.on('update', fake)
  addon1.emitter.emit('update')
  addon2.emitter.emit('update')
  expect(fake.calledTwice).toBe(true)
})

test('getText', () => {
  const addon1 = getFakeAddon('a')
  const addon2 = getFakeAddon('b')
  const concatAddon = new ConcatAddon(addon1, addon2)
  expect(concatAddon.getText()).toBe('ab')
})
