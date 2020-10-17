/* global jest */

// Mocker for fs

const fs = jest.createMockFromModule('fs')

const files = require('../test-lib/files')
const tick = require('../test-lib/tick')
const { Readable, PassThrough } = require('stream')

fs._readStreamErrorFiles = new Set()

fs._reset = () => {
  fs._readStreamErrorFiles.clear()
}

fs.createReadStream = path => {
  if (fs._readStreamErrorFiles.has(path)) {
    const stream = new PassThrough()
    tick().then(() => {
      stream.destroy(new Error('Error creating a read stream.'))
    })
    return stream
  }
  if (files.has(path)) {
    return Readable.from(files.get(path).split(''))
  } else {
    throw new Error('File doesn\'t exist')
  }
}

module.exports = fs
