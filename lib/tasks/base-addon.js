import EventEmitter from 'eventemitter3'

class BaseAddon extends EventEmitter {
  update () {
    this.emit('update')
  }
  transformLine (line) {
    return { line, styles: [] }
  }
}

export default BaseAddon
