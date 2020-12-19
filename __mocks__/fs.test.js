/* eslint-env jest */

import { createReadStream, _readStreamErrorFiles, _reset } from './fs.js'
import { reset, setFile, NormalFile } from '../test-lib/files.js'
import chunks from '../test-lib/chunks.js'

afterEach(reset)
afterEach(_reset)

test('createReadStream', async () => {
  setFile('file', new NormalFile('hi'))
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
