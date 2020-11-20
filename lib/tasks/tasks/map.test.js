import MapTask from './map.js'
import getFakeTask from '../../../test-lib/tasks/fake-task.js'
import EventEmitter, { _reset as resetEventEmitter } from '../../../__mocks__/eventemitter3.js'

afterEach(resetEventEmitter)

describe('set', () => {
  test('new key', () => {
    const mapTask = new MapTask()
    const task = getFakeTask()
    mapTask.set('a', task)
    expect(mapTask.map.get('a')).toBe(task)
    expect(mapTask.map.size).toBe(1)
    expect(EventEmitter.prototype.on.calledOnceWith('update', mapTask.updateHandler)).toBe(true)
  })

  test('overwrite key', () => {
    const mapTask = new MapTask()
    const task = getFakeTask()
    mapTask.set('a', getFakeTask())
    mapTask.set('a', task)
    expect(EventEmitter.prototype.off.calledOnceWith('update', mapTask.updateHandler)).toBe(true)
    expect(mapTask.map.get('a')).toBe(task)
    expect(mapTask.map.size).toBe(1)
    expect(EventEmitter.prototype.on.calledTwice).toBe(true)
    expect(EventEmitter.prototype.on.getCall(1).calledWith('update', mapTask.updateHandler)).toBe(true)
  })
})

describe('delete', () => {
  test('no key', () => {
    const mapTask = new MapTask()
    mapTask.delete('not a key')
    expect(EventEmitter.prototype.off.notCalled).toBe(true)
  })

  test('delete key', () => {
    const mapTask = new MapTask()
    mapTask.set('a', getFakeTask())
    mapTask.delete('a')
    expect(EventEmitter.prototype.off.calledOnceWith('update', mapTask.updateHandler)).toBe(true)
    expect(mapTask.map.size).toBe(0)
  })
})

test('getLines', () => {
  const mapTask = new MapTask()
  mapTask.set('a', getFakeTask(['a', 'b']))
  mapTask.set('b', getFakeTask(['c', 'd']))
  expect(mapTask.getLines()).toStrictEqual(['a', 'b', 'c', 'd'])
})
