import CustomTask from './custom.js'
import getFakeAddon from '../../../test-lib/tasks/fake-addon.js'
import sinon from 'sinon'

test('forwards updates', () => {
  const addon = getFakeAddon()
  const task = new CustomTask(addon)
  expect(typeof addon.emitter._events.update.fn).toBe('function')
  const fake = sinon.fake()
  task.emitter.on('update', fake)
  addon.emitter.emit('update')
  expect(fake.calledOnce).toBe(true)
})

test('getLines', () => {
  expect(new CustomTask(getFakeAddon('text')).getLines()).toStrictEqual(['text'])
})
