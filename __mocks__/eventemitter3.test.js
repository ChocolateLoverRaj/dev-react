import EventEmitter, { _reset } from './eventemitter3.js'

afterEach(_reset)

test('on', () => {
  const ee = new EventEmitter
  const args = [Symbol(), () => { }]
  ee.on(...args)
  expect(EventEmitter.prototype.on.calledOnceWith(...args)).toBe(true)
})

test('off', () => {
  const ee = new EventEmitter
  const args = [Symbol(), () => { }]
  ee.off(...args)
  expect(EventEmitter.prototype.off.calledOnceWith(...args)).toBe(true)
})


test('_reset', () => {
  new EventEmitter().on('', () => { })
  new EventEmitter().off('', () => { })
  _reset()
  expect(EventEmitter.prototype.on.notCalled).toBe(true)
  expect(EventEmitter.prototype.off.notCalled).toBe(true)
})
