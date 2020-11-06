/* global afterEach, test, describe, expect */

import DevReact from './index.js'
import { setFile, Dir, reset } from '../test-lib/files.js'
import normalize from './__mocks__/normalize.js'
import noResolve from '../test-lib/no-resolve.js'
import tick from '../test-lib/tick.js'
import request from 'supertest'
import chokidar, { FSWatcher } from 'chokidar'

afterEach(reset)
afterEach(() => {
  normalize.resetHistory()
  chokidar.watch.resetHistory()
  FSWatcher.prototype.close.resetHistory()
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

  test('server', async () => {
    const devReact = new DevReact('dir')
    expect((await request(devReact.server)
      .get('/')
    ).notFound).toBe(true)
  })
})

test('watch', async () => {
  setFile('dir', new Dir())
  const devReact = new DevReact('dir')
  const start = devReact.watch()
  await noResolve(start, tick())
  expect(chokidar.watch.calledOnceWith('dir', { depth: 0 })).toBe(true)
  chokidar.watch.getCall(0).returnValue.emit('ready')
  await start
})

describe('unwatch', () => {
  test('calls close', async () => {
    setFile('dir', new Dir())
    const devReact = new DevReact('dir')
    const watch = devReact.watch()
    await tick()
    chokidar.watch.getCall(0).returnValue.emit('ready')
    await watch
    await devReact.unwatch()
    expect(FSWatcher.prototype.close.calledOnce).toBe(true)
  })

  test('no close', async () => {
    setFile('dir', new Dir())
    const devReact = new DevReact('dir')
    await devReact.unwatch()
    expect(FSWatcher.prototype.close.notCalled).toBe(true)
  })
})

describe('errors', () => {
  test('no new', () => {
    expect(() => {
      DevReact()
    }).toThrowErrorMatchingSnapshot()
  })

  describe('watch', () => {
    test('Not found', async () => {
      const devReact = new DevReact('dir')
      await expect(devReact.watch()).rejects.toMatchSnapshot()
    })

    test('Access', async () => {
      const dir = new Dir()
      dir.canRead = false
      setFile('dir', dir)
      const devReact = new DevReact('dir')
      await expect(devReact.watch()).rejects.toMatchSnapshot()
    })
  })
})
