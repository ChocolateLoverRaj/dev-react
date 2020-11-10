// The base addon
import EventEmitter from 'eventemitter3'

class Addon {
  constructor () {
    this.emitter = new EventEmitter()
  }
  update () {
    this.emitter.emit('update')
  }
  getText () {
    return ''
  }
}

export default Addon
