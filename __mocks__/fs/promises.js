/* global jest */

// Mocker for fs/promises

const fs = jest.createMockFromModule('fs/promises')

const EventEmitter = require('eventemitter3')

const frozen = new Set()
fs._frozen = frozen
const errorFiles = new Set()
fs._errorFiles = errorFiles
const files = new Map()
fs._files = files
fs._reset = () => {
  frozen.clear()
  errorFiles.clear()
  files.clear()
}

const mock = new EventEmitter()
  .on('freeze', filename => {
    frozen.add(filename)
  })
  .on('unfreeze', filename => {
    frozen.delete(filename)
  })
  .on('throw', filename => {
    errorFiles.add(filename)
  })
  .on('reset', () => {
    fs._reset()
  })
fs._mock = mock

const onceUnfrozen = filename => new Promise((resolve, reject) => {
  const handler = f => {
    if (f === filename) {
      mock.off(handler)
      resolve()
    }
  }
  mock.on('unfreeze', handler)
})

fs.writeFile = async (filename, content) => {
  if (errorFiles.has(filename)) {
    throw new Error('Error writing file.')
  }
  const write = () => {
    files.set(filename, content)
    mock.emit('wrote', filename, content)
  }
  if (frozen.has(filename)) {
    await onceUnfrozen(filename)
    write()
  } else {
    write()
  }
}

fs.readFile = async filename => {
  if (errorFiles.has(filename)) {
    throw new Error('Error reading file.')
  }
  const read = () => {
    mock.emit('read', filename)
    return files.get(filename)
  }
  if (frozen.has(filename)) {
    await onceUnfrozen(filename)
    return read()
  } else {
    return read()
  }
}

fs.unlink = async filename => {
  files.delete(filename)
  mock.emit('unlinked', filename)
}

module.exports = fs
