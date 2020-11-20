import sliceAnsi, { _reset } from './slice-ansi.js'

afterEach(_reset)

test('sliceAnsi', () => {
  expect(sliceAnsi('text', 0, 2)).toBe('te')
  expect(sliceAnsi.calledOnceWith('text', 0, 2)).toBe(true)
})

test('_reset', () => {
  sliceAnsi('text', 0, 2)
  _reset()
  expect(sliceAnsi.notCalled).toBe(true)
})
