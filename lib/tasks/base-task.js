import EventEmitter from 'eventemitter3'

class BaseTask extends EventEmitter {
  constructor () {
    super()

  }
  update () {
    this.emit('update')
  }
  getLines () {
    return []
  }
}

export default BaseTask
