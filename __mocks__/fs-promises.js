// Mocker for fs/promises
import { NormalFile, reset, unlinkFile, setFile, getFile, Dir } from '../test-lib/files.js'
import { constants } from './fs.js'
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

export const access = async (filename, permissions) => {
  const file = getFile(filename)
  const filePermissions = (file.canRead * constants.R_OK) | (file.canWrite * constants.W_OK)
  if (permissions !== (permissions & filePermissions)) {
    throw new Error('Bad permissions.')
  }
}

class Stats {
  constructor (file) {
    this.file = file
  }

  isDirectory () {
    return this.file instanceof Dir
  }
}

export const stat = async filename => {
  const file = getFile(filename)
  if (!file.canRead) {
    const error = new Error('Cannot access file.')
    error.code = 'EACCES'
    throw error
  }
  return new Stats(getFile(filename))
}

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

export const readdir = async (path, options = { withFileTypes: false }) => {
  const files = getFile(path).files
  if (options.withFileTypes) {
    return [...files].map(([name, file]) => ({
      name,
      isDirectory () {
        return file instanceof Dir
      }
    }))
  }
  return [...files.keys()]
}

export const mkdir = async path => {
  setFile(path, new Dir())
}
