/* global afterEach, test, expect */

import Dirs, { _reset } from './dirs.js'

afterEach(_reset)

test('set', () => {
  const dirs = new Dirs()
  dirs.set('page', 'page')
  expect(Dirs.prototype.set.calledOnceWith('page')).toBe(true)
})

test('delete', () => {
  const dirs = new Dirs()
  dirs.delete('page')
  expect(Dirs.prototype.delete.calledOnceWith('page')).toBe(true)
})

test('destroy', callback => {
  const destroy = new Dirs().destroy()
  expect(Dirs.prototype.destroy.calledOnce).toBe(true)
  destroy.then(callback)
})

test('_reset', () => {
  const dirs = new Dirs()
  dirs.set('page', 'page')
  dirs.delete('page')
  dirs.destroy()
  _reset()
  expect(Dirs.prototype.set.notCalled).toBe(true)
  expect(Dirs.prototype.delete.notCalled).toBe(true)
  expect(Dirs.prototype.destroy.notCalled).toBe(true)
})
