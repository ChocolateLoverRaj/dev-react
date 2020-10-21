/* global afterEach, test, expect */

import { createReadStream, _readStreamErrorFiles, _reset } from './fs.js'
import files from '../test-lib/files.js'
import chunks from '../test-lib/chunks.js'

afterEach(() => {
  files.clear()
})
afterEach(_reset)

test('createReadStream', async () => {
  files.set('file', 'hi')
  expect(await chunks(createReadStream('file'))).toStrictEqual(['h', 'i'])
})

test('_readStreamErrorFiles', async () => {
  _readStreamErrorFiles.add('file')
  await expect(chunks(createReadStream('file'))).rejects.toMatchSnapshot()
})

test('_reset', () => {
  _readStreamErrorFiles.add('file')
  _reset()
  expect(_readStreamErrorFiles.size).toBe(0)
})

test('non-existent file', async () => {
  expect(() => {
    createReadStream('file')
  }).toThrowErrorMatchingSnapshot()
})
