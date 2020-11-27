import sinon from 'sinon'
import EventEmitter from 'eventemitter3'

const getFakeAddon = text => ({
  getText: sinon.fake(() => text),
  emitter: new EventEmitter()
})

export default getFakeAddon
