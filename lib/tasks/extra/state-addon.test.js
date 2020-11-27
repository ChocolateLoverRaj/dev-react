/* global test, expect, describe */

import StateAddon from './state-addon.js'
import getFakeAddon from '../../../test-lib/tasks/fake-addon.js'
import sinon from 'sinon'
import chalk from 'chalk'

test('default state', () => {
  const fakeAddon = getFakeAddon()
  const stateAddon = new StateAddon(fakeAddon)
  expect(stateAddon.state).toMatchSnapshot()
})

test('forwards updates', () => {
  const fakeAddon = getFakeAddon()
  const stateAddon = new StateAddon(fakeAddon)
  expect(typeof fakeAddon.emitter._events.update.fn).toBe('function')
  const fake = sinon.fake()
  stateAddon.emitter.on('update', fake)
  fakeAddon.emitter.emit('update')
  expect(fake.calledOnce).toBe(true)
})

describe('getText', () => {
  const testColor = (state, color) => {
    const fakeAddon = getFakeAddon('text')
    const stateAddon = new StateAddon(fakeAddon)
    stateAddon.state = state
    expect(stateAddon.getText()).toBe(chalk.keyword(color)('text'))
  }

  test('in progress', () => {
    testColor('in progress', 'yellow')
  })

  test('complete', () => {
    testColor('complete', 'green')
  })

  test('failed', () => {
    testColor('failed', 'red')
  })
})
