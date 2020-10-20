/* global jest */

// Mocker for fs

import files from '../files/index.js'
import tick from '../tick/index.js'
import { Readable, PassThrough } from 'stream'

const fs = jest.createMockFromModule('fs')

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

export default fs
