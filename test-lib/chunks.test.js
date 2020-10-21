/* global test, expect */

import chunks from './chunks.js'
import { Readable } from 'stream'

const theChunks = ['a', 'b', 'c']

test('no destroy', async () => {
  const stream = Readable.from(theChunks)
  expect(await chunks(stream)).toStrictEqual(theChunks)
})

test('destroy', async () => {
  const stream = Readable.from(theChunks)
  const error = new Error('Some read error.')
  const expectError = expect(chunks(stream)).rejects.toBe(error)
  stream.destroy(error)
  await expectError
})
