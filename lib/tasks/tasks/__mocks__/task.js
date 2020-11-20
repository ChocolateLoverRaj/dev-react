import EventEmitter from '../../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

class Task {
  constructor () {
    this.emitter = new EventEmitter()
  }
  update () {
    this.emitter.emit('update')
  }
}
  Task.prototype.getLines = sinon.fake(function() {
  return []
})

export const _reset = () => {
  Task.prototype.getLines.resetHistory()
}

export default Task
