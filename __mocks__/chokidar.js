// Mocker for chokidar
import EventEmitter from 'eventemitter3'
import sinon from 'sinon'

const chokidar = {}

class FSWatcher extends EventEmitter { }

chokidar.watch = sinon.fake(() => new FSWatcher())

export default chokidar
