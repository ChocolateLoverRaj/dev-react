import sinon from 'sinon'
import EventEmitter from '../../__mocks__/eventemitter3.js'

const getFakeAddon = text => ({
  getText: sinon.fake(() => text),
  emitter: new EventEmitter()
})

export default getFakeAddon
