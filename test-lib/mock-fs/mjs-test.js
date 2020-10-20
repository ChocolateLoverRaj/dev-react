/* global jest, afterEach, test, expect */

import { createReadStream, _readStreamErrorFiles, _reset } from 'fs'
import files from '../files/index.js'
import chunks from '../chunks/index.js'

jest.mock('fs')

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
  expect(createReadStream.bind(undefined, 'file')).toThrowErrorMatchingSnapshot()
})
