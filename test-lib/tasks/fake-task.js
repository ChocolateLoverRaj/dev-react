import sinon from 'sinon'
import EventEmitter from '../../__mocks__/eventemitter3.js'

const getFakeTask = lines => ({
  getLines: sinon.fake(() => lines),
  emitter: new EventEmitter()
})

export default getFakeTask
