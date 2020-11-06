// Mocker for chokidar
import EventEmitter from 'eventemitter3'
import sinon from 'sinon'

const chokidar = {}

export class FSWatcher extends EventEmitter { };

FSWatcher.prototype.close = sinon.fake(() => Promise.resolve())

chokidar.watch = sinon.fake(() => new FSWatcher())

export default chokidar
