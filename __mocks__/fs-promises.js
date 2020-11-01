// Mocker for fs/promises
import { NormalFile, reset, unlinkFile, setFile } from '../test-lib/files.js'
import EventEmitter from 'eventemitter3'

export const _frozen = new Set()
export const _errorFiles = new Set()
export const _reset = () => {
  _frozen.clear()
  _errorFiles.clear()
  reset()
}

export const _mock = new EventEmitter()
  .on('unfreeze', filename => {
    _frozen.delete(filename)
  })

const onceUnfrozen = filename => new Promise(resolve => {
  const handler = f => {
    if (f === filename) {
      _mock.off('unfreeze', handler)
      resolve()
    }
  }
  _mock.on('unfreeze', handler)
})

export const writeFile = async (filename, content) => {
  if (_errorFiles.has(filename)) {
    throw new Error('Error writing file.')
  }
  const write = () => {
    setFile(filename, new NormalFile(content))
    _mock.emit('wrote', filename, content)
  }
  if (_frozen.has(filename)) {
    await onceUnfrozen(filename)
    write()
  } else {
    write()
  }
}

export const unlink = async filename => {
  if (_errorFiles.has(filename)) {
    throw new Error('Error unlinking file.')
  }
  unlinkFile(filename)
}
