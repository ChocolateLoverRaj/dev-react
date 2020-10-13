/* global test, expect */

jest.mock('fs/promises')

const FileOutput = require('./file-output.cjs')

test('build error', async () => {
  console.log('testing')
})