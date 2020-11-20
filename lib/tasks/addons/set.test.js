import SetAddon from './set.js'
import Addon from './__mocks__/addon.js'
import TextAddon, { _reset as resetTextAddon } from './__mocks__/text.js'
import ConcatAddon, { _reset as resetConcatAddon, _func } from './__mocks__/concat.js'
import EventEmitter, { _reset as resetEventEmitter } from '../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

afterEach(() => {
  resetTextAddon()
  resetConcatAddon()
  resetEventEmitter()
})

describe('constructor', () => {
  test('addons', () => {
    const addon1 = new Addon()
    const addon2 = new Addon()
    const addon = new SetAddon(addon1, addon2)
    expect(addon.addons.has(addon1)).toBe(true)
    expect(addon.addons.has(addon2)).toBe(true)
    expect(addon.addons.size).toBe(2)
  })

  test('forwards updates', () => {
    const addon1 = new Addon()
    const addon2 = new Addon()
    const addon = new SetAddon(addon1, addon2)
    expect(EventEmitter.prototype.on.calledTwice).toBe(true)
    const fake = sinon.fake()
    addon.emitter.on('update', fake)
    addon1.emitter.emit('update')
    addon2.emitter.emit('update')
    expect(fake.calledTwice).toBe(true)
  })
})

describe('getText', () => {
  test('calls getText', () => {
    const addon1 = new Addon()
    const addon2 = new Addon()
    new SetAddon(addon1, addon2).getText()
    expect(Addon.prototype.getText.calledTwice).toBe(true)
  })

  test('creates ConcatAddon', () => {
    const addon1 = new Addon()
    const addon2 = new Addon()
    new SetAddon(addon1, addon2).getText()
    expect(_func.calledOnceWith(addon1, addon2)).toBe(true)
    expect(ConcatAddon.prototype.getText.calledOnceWith()).toBe(true)
  })

  test('works', () => {
    const addon1 = new TextAddon()
    const addon2 = new TextAddon()
    expect(new SetAddon(addon1, addon2).getText()).toBe('text' + 'text')
  })
})

describe('add', () => {
  test('adds to set', () => {
    const setAddon = new SetAddon()
    const addon = new Addon()
    setAddon.add(addon)
    expect(setAddon.addons.has(addon)).toBe(true)
    expect(setAddon.addons.size).toBe(1)
  })

  test('forwards updates', () => {
    const setAddon = new SetAddon()
    const addon = new Addon()
    setAddon.add(addon)
    expect(EventEmitter.prototype.on.calledOnce).toBe(true)
    const fake = sinon.fake()
    setAddon.emitter.on('update', fake)
    addon.emitter.emit('update')
    expect(fake.calledOnce).toBe(true)
  })
})
