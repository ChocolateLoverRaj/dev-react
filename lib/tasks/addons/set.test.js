import SetAddon from './set.js'
import sinon from 'sinon'
import getFakeAddon from '../../../test-lib/tasks/fake-addon.js'

describe('constructor', () => {
  test('addons', () => {
    const addon1 = getFakeAddon()
    const addon2 = getFakeAddon()
    const addon = new SetAddon(addon1, addon2)
    expect(addon.addons.has(addon1)).toBe(true)
    expect(addon.addons.has(addon2)).toBe(true)
    expect(addon.addons.size).toBe(2)
  })

  test('forwards updates', () => {
    const addon1 = getFakeAddon()
    const addon2 = getFakeAddon()
    const addon = new SetAddon(addon1, addon2)
    expect(typeof addon1.emitter._events.update.fn).toBe('function')
    expect(typeof addon2.emitter._events.update.fn).toBe('function')
    const fake = sinon.fake()
    addon.emitter.on('update', fake)
    addon1.emitter.emit('update')
    addon2.emitter.emit('update')
    expect(fake.calledTwice).toBe(true)
  })
})

test('getText', () => {
  const addon1 = getFakeAddon('a')
  const addon2 = getFakeAddon('b')
  expect(new SetAddon(addon1, addon2).getText()).toBe('ab')
})

describe('add', () => {
  test('adds to set', () => {
    const setAddon = new SetAddon()
    const addon = getFakeAddon()
    setAddon.add(addon)
    expect(setAddon.addons.has(addon)).toBe(true)
    expect(setAddon.addons.size).toBe(1)
  })

  test('forwards updates', () => {
    const setAddon = new SetAddon()
    const addon = getFakeAddon()
    setAddon.add(addon)
    expect(typeof addon.emitter._events.update.fn).toBe('function')
    const fake = sinon.fake()
    setAddon.emitter.on('update', fake)
    addon.emitter.emit('update')
    expect(fake.calledOnce).toBe(true)
  })
})
