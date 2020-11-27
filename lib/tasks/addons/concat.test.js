/* global test, expect */

import ConcatAddon from './concat.js'
import getFakeAddon from '../../../test-lib/tasks/fake-addon.js'
import sinon from 'sinon'

test('forwards updates', () => {
  const addon1 = getFakeAddon()
  const addon2 = getFakeAddon()
  const concatAddon = new ConcatAddon(addon1, addon2)
  expect(typeof addon1.emitter._events.update.fn).toBe('function')
  expect(typeof addon2.emitter._events.update.fn).toBe('function')
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
