import getFakeAddon from './fake-addon.js'
import EventEmitter from '../../__mocks__/eventemitter3.js'

test('getLines', () => {
  expect(getFakeAddon('text').getText()).toStrictEqual('text')
})

test('emitter', () => {
  expect(getFakeAddon().emitter).toBeInstanceOf(EventEmitter)
})
