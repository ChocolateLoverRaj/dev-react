import EventEmitter, { _reset } from './eventemitter3.js'

afterEach(_reset)

test('on', () => {
  const ee = new EventEmitter
  const args = [Symbol(), () => { }]
  ee.on(...args)
  expect(EventEmitter.prototype.on.calledOnceWith(...args)).toBe(true)
})

test('_reset', () => {
  new EventEmitter().on('', () => { })
  _reset()
  expect(EventEmitter.prototype.on.notCalled).toBe(true)
})
