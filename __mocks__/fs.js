/* global jest */

// Mocker for fs

const fs = jest.createMockFromModule('fs')

const files = require('../test-lib/files')
const { Readable } = require('stream')

fs.createReadStream = path => {
  if (files.has(path)) {
    return Readable.from(files.get(path).split(''))
  } else {
    throw new Error('File doesn\'t exist')
  }
}

module.exports = fs
