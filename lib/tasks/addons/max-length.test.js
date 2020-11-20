import MaxLengthAddon from './max-length.js'
import getFakeAddon from '../../../test-lib/tasks/fake-addon.js'
import EventEmitter, { _reset as resetEventEmitter } from '../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'
import chalk from 'chalk'

afterEach(resetEventEmitter)

test('forwards updates', () => {
  const addon = getFakeAddon()
  const maxLengthAddon = new MaxLengthAddon(addon, 0)
  expect(EventEmitter.prototype.on.calledOnce).toBe(true)
  const fake = sinon.fake()
  maxLengthAddon.emitter.on('update', fake)
  addon.emitter.emit('update')
  expect(fake.calledOnce).toBe(true)
})

describe('getText', () => {
  test('normal string', () => {
    const textAddon = getFakeAddon('text')
    const maxLengthAddon = new MaxLengthAddon(textAddon, 2)
    expect(maxLengthAddon.getText()).toBe('te')
  })

  test('colored string', () => {
    const textAddon = getFakeAddon(chalk.red('text'))
    const maxLengthAddon = new MaxLengthAddon(textAddon, 2)
    expect(maxLengthAddon.getText()).toBe(chalk.red('te'))
  })
})
