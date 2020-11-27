// A very simple task, inherited by more useful tasks
import EventEmitter from 'eventemitter3'

class Task {
  constructor () {
    this.emitter = new EventEmitter()
  }

  update () {
    this.emitter.emit('update')
  }

  getLines () {
    return []
  }
}

export default Task
