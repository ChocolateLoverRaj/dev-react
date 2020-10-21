// Mocker for fs
import files from '../test-lib/files.js'
import tick from '../test-lib/tick.js'
import { Readable, PassThrough } from 'stream'

export const _readStreamErrorFiles = new Set()

export const _reset = () => {
  _readStreamErrorFiles.clear()
}

export const createReadStream = path => {
  if (_readStreamErrorFiles.has(path)) {
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
