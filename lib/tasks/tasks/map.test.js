import MapTask from './map.js'
import getFakeTask from '../../../test-lib/tasks/fake-task.js'
import sinon from 'sinon'

describe('set', () => {
  test('new key', () => {
    const mapTask = new MapTask()
    const task = getFakeTask()
    mapTask.set('a', task)
    expect(mapTask.map.get('a')).toBe(task)
    expect(mapTask.map.size).toBe(1)
    expect(task.emitter._events.update.fn).toBe(mapTask.updateHandler)
    const fake = sinon.fake()
    mapTask.emitter.on('update', fake)
    mapTask.updateHandler()
    expect(fake.calledOnce).toBe(true)
  })

  test('overwrite key', () => {
    const mapTask = new MapTask()
    const task = getFakeTask()
    mapTask.set('a', getFakeTask())
    mapTask.set('a', task)
    expect(task.emitter._events.update.fn).toBe(mapTask.updateHandler)
    expect(mapTask.map.get('a')).toBe(task)
    expect(mapTask.map.size).toBe(1)
  })
})

describe('delete', () => {
  test('no key', () => {
    const mapTask = new MapTask()
    mapTask.delete('not a key')
  })

  test('delete key', () => {
    const mapTask = new MapTask()
    const fakeTask = getFakeTask()
    mapTask.set('a', fakeTask)
    mapTask.delete('a')
    expect(Object.prototype.hasOwnProperty.call(fakeTask.emitter._events, 'update')).toBe(false)
    expect(mapTask.map.size).toBe(0)
  })
})

test('getLines', () => {
  const mapTask = new MapTask()
  mapTask.set('a', getFakeTask(['a', 'b']))
  mapTask.set('b', getFakeTask(['c', 'd']))
  expect(mapTask.getLines()).toStrictEqual(['a', 'b', 'c', 'd'])
})
