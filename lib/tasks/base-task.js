import EventEmitter from 'eventemitter3'

class BaseTask extends EventEmitter {
  constructor () {
    super()

  }
  getLines () {
    return []
  }
  update () {
    this.emit('update')
  }
}

export default BaseTask
