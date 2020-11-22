import getFakeAddon from './fake-addon.js'
import EventEmitter from 'eventemitter3'

test('getLines', () => {
  expect(getFakeAddon('text').getText()).toStrictEqual('text')
})

test('emitter', () => {
  expect(getFakeAddon().emitter).toBeInstanceOf(EventEmitter)
})
