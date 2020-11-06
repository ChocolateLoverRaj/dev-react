/* global afterEach, test, describe, expect */

import DevReact from './index.js'
import { setFile, Dir, reset } from '../test-lib/files.js'
import normalize from './__mocks__/normalize.js'
import noResolve from '../test-lib/no-resolve.js'
import tick from '../test-lib/tick.js'
import chokidar from 'chokidar'

afterEach(reset)
afterEach(() => {
  normalize.resetHistory()
})

describe('constructor', () => {
  test('instanceof', () => {
    const devReact = new DevReact('dir')
    expect(devReact).toBeInstanceOf(DevReact)
  })

  test('calls normalize.js', () => {
    (() => new DevReact('dir'))()
    expect(normalize.calledOnceWith('dir')).toBe(true)
  })
})

test('start', async () => {
  setFile('dir', new Dir())
  const devReact = new DevReact('dir')
  const start = devReact.start()
  await noResolve(start, tick())
  chokidar.watch.calledOnceWith('dir', { depth: 0 })
  chokidar.watch.getCall(0).returnValue.emit('ready')
  await start
})

describe('errors', () => {
  test('no new', () => {
    expect(() => {
      DevReact()
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
