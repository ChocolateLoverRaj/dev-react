/* global test, expect, describe */

import AutoStateAddon from './auto-state-addon.js'
import StateAddon from './state-addon.js'
import getFakeAddon from '../../../test-lib/tasks/fake-addon.js'
import sinon from 'sinon'

const getStateAddon = state => {
  const fakeAddon = getFakeAddon('text')
  const stateAddon = new StateAddon(fakeAddon)
  if (state) {
    stateAddon.state = state
  }
  return stateAddon
}

test('forwards updates', () => {
  const headAddon = getFakeAddon()
  const addon1 = getStateAddon()
  const addon2 = getStateAddon()
  const addon = new AutoStateAddon(headAddon, addon1, addon2)
  expect(typeof headAddon.emitter._events.update.fn).toBe('function')
  expect(typeof addon1.emitter._events.update.fn).toBe('function')
  expect(typeof addon2.emitter._events.update.fn).toBe('function')
  const fake = sinon.fake()
  addon.emitter.on('update', fake)
  headAddon.emitter.emit('update')
  addon1.emitter.emit('update')
  addon2.emitter.emit('update')
  expect(fake.calledThrice).toBe(true)
})

describe('getText', () => {
  test('failed', () => {
    const addon = new AutoStateAddon(
      getFakeAddon('text'),
      getStateAddon('in progress'),
      getStateAddon('complete'),
      getStateAddon('failed')
    )
    expect(addon.getText()).toBe(getStateAddon('failed').getText())
  })

  test('in progress', () => {
    const addon = new AutoStateAddon(
      getFakeAddon('text'),
      getStateAddon('complete'),
      getStateAddon('in progress')
    )
    expect(addon.getText()).toBe(getStateAddon('in progress').getText())
  })

  test('complete', () => {
    const addon = new AutoStateAddon(
      getFakeAddon('text'),
      getStateAddon('complete'),
      getStateAddon('complete')
    )
    expect(addon.getText()).toBe(getStateAddon('complete').getText())
  })
})
