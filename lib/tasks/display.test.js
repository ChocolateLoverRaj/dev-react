/* global test, expect */

// There are no actual tests for display.js because it uses process.stdout
import { dirname } from 'dirname-filename-esm'
import { readFileSync } from 'fs'
import { createHash } from 'crypto'
import { join } from 'path'

const __dirname = dirname(import.meta)

test('okay', () => {
  const hash = createHash('sha256').update(readFileSync(join(__dirname, './display.js'))).digest('hex')
  expect(hash).toMatchSnapshot()
})
