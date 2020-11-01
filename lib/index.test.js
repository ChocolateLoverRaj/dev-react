/* global test, describe, expect */

import DevReact from './index.js'
import { setFile, Dir, reset } from '../test-lib/files.js'

afterEach(reset)

test('constructor', () => {
  const devReact = new DevReact('dir')
  expect(devReact).toBeInstanceOf(DevReact)
})

test('start', async () => {
  setFile('dir', new Dir())
  const devReact = new DevReact('dir')
  await devReact.start()
})

describe('errors', () => {
  test('no new', () => {
    expect(() => {
      DevReact()
    }).toThrowErrorMatchingSnapshot()
  })

  test('bad inputDir', () => {
    expect(() => {
      new DevReact()
    }).toThrowErrorMatchingSnapshot()
    expect(() => {
      new DevReact(69)
    }).toThrowErrorMatchingSnapshot()
    expect(() => {
      new DevReact({})
    }).toThrowErrorMatchingSnapshot()
  })

  describe('start', () => {
    test('Not found', async () => {
      const devReact = new DevReact('dir')
      await expect(devReact.start()).rejects.toMatchSnapshot()
    })

    test('Access', async () => {
      const dir = new Dir()
      dir.canRead = false
      setFile('dir', dir)
      const devReact = new DevReact('dir')
      await expect(devReact.start()).rejects.toMatchSnapshot()
    })
  })
})
