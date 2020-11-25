import Display, { _reset } from './display.js'

afterEach(_reset)

test('update', () => {
  expect(new Display().update(['some', 'lines'])).resolves.toBe(undefined)
  expect(Display.prototype.update.calledOnceWith(['some', 'lines'])).toBe(true)
})

test('close', () => {
  expect(new Display().close()).resolves.toBe(undefined)
  expect(Display.prototype.close.calledOnce).toBe(true)
})

test('_reset', () => {
  const display = new Display()
  display.update()
  display.close()
  _reset()
  expect(Display.prototype.update.notCalled).toBe(true)
  expect(Display.prototype.close.notCalled).toBe(true)
})
