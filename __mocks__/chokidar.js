// Mocker for chokidar
import EventEmitter from 'eventemitter3'

const chokidar = {}

class FSWatcher extends EventEmitter {
  constructor () {
    super()
    
  }
}

chokidar.watch = jest.fn()

chokidar.watch.mockImplementation(() => new FSWatcher())

export default chokidar
