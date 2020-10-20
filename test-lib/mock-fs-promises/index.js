/* global jest */

// Mocker for fs/promises

import files from '../../test-lib/files/index.js'
import EventEmitter from 'eventemitter3'

// TODO: Update tests to be specific to files and dirs
// TODO: Update fs mocks to check if file is file or dir
const fs = jest.createMockFromModule('fs/promises')

fs._frozen = new Set()
fs._errorFiles = new Set()
fs._reset = () => {
  fs._frozen.clear()
  fs._errorFiles.clear()
  files.clear()
}

fs._mock = new EventEmitter()
  .on('unfreeze', filename => {
    fs._frozen.delete(filename)
  })

const onceUnfrozen = filename => new Promise(resolve => {
  const handler = f => {
    if (f === filename) {
      fs._mock.off('unfreeze', handler)
      resolve()
    }
  }
  fs._mock.on('unfreeze', handler)
})

fs.writeFile = async (filename, content) => {
  if (fs._errorFiles.has(filename)) {
    throw new Error('Error writing file.')
  }
  const write = () => {
    files.set(filename, content)
    fs._mock.emit('wrote', filename, content)
  }
  if (fs._frozen.has(filename)) {
    await onceUnfrozen(filename)
    write()
  } else {
    write()
  }
}

fs.unlink = async filename => {
  if (fs._errorFiles.has(filename)) {
    throw new Error('Error unlinking file.')
  }
  if (!files.has(filename)) {
    const err = new Error('Error unlinking file. File doesn\'t exist.')
    err.code = 'ENOENT'
    throw err
  }
  files.delete(filename)
}

export default fs
