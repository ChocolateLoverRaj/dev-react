import sinon from 'sinon'
import EventEmitter from 'eventemitter3'

const getFakeTask = lines => ({
  getLines: sinon.fake(() => lines),
  emitter: new EventEmitter()
})

export default getFakeTask
