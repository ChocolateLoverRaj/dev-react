// Mocker for chokidar
import EventEmitter from 'eventemitter3'
import sinon from 'sinon'

const chokidar = {}

export class FSWatcher extends EventEmitter { };

let failClose = false
export const _failClose = () => {
  failClose = true
}
FSWatcher.prototype.close = sinon.fake(() => failClose ? Promise.reject(new Error()) : Promise.resolve())

chokidar.watch = sinon.fake(() => new FSWatcher())

export const _reset = () => {
  failClose = false
  FSWatcher.prototype.close.resetHistory()
  chokidar.watch.resetHistory()
}

export default chokidar
