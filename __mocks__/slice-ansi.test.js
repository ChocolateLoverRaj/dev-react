import sliceAnsi, { _reset } from './slice-ansi.js'

afterEach(_reset)

test('sliceAnsi', () => {
  const arg = Symbol()
  sliceAnsi(arg)
  expect(sliceAnsi.calledOnceWith(arg)).toBe(true)
})

test('_reset', () => {
  sliceAnsi()
  _reset()
  expect(sliceAnsi.notCalled).toBe(true)
})
