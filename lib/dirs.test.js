/* global test, expect */

import Dirs from './dirs.js'
import CustomTask from './tasks/tasks/custom.js'
import NameTask from './tasks/extra/name-task.js'
import TextAddon from './tasks/addons/text.js'
import sinon from 'sinon'

const getDir = name => ({
  name,
  task: new NameTask(name, new CustomTask(new TextAddon(name))),
  destroy: sinon.spy(async () => { })
})

test('set', () => {
  const dirs = new Dirs()
  let updateLines
  dirs.task.emitter.on('update', () => {
    updateLines = dirs.task.getLines()
  })
  dirs.set('b', getDir('b'))
  const firstLines = dirs.task.getLines()
  expect(updateLines).toStrictEqual(firstLines)
  expect(firstLines).toStrictEqual(['b'])
  dirs.set('a', getDir('a'))
  const secondLines = dirs.task.getLines()
  expect(updateLines).toStrictEqual(secondLines)
  expect(secondLines).toStrictEqual(['a', 'b'])
})

test('delete', async () => {
  const dirs = new Dirs()
  let updateLines
  dirs.task.emitter.on('update', () => {
    updateLines = dirs.task.getLines()
  })
  const dir = getDir('a')
  dirs.set('a', dir)
  dirs.delete('a')
  expect(dir.destroy.calledOnce).toBe(true)
  await dir.destroy.firstCall.returnValue
  const newLines = dirs.task.getLines()
  expect(updateLines).toStrictEqual(newLines)
  expect(newLines).toStrictEqual([])
})

test('destroy', async () => {
  const dirs = new Dirs()
  const updateLog = []
  dirs.task.emitter.on('update', () => {
    updateLog.push(dirs.task.getLines())
  })
  const dir1 = getDir('a')
  const dir2 = getDir('b')
  dirs.set('a', dir1)
  dirs.set('b', dir2)
  const destroy = dirs.destroy()
  expect(dir1.destroy.calledOnce).toBe(true)
  expect(dir2.destroy.calledOnce).toBe(true)
  await destroy
  expect(updateLog).toStrictEqual([
    ['a'],
    ['a', 'b'],
    ['b'],
    []
  ])
})
