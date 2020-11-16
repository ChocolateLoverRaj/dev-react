import chalk, { _reset } from './chalk.js'

afterEach(_reset)

test('keyword', () => {
  const arg = Symbol()
  const colorer = chalk.keyword(arg)
  expect(chalk.keyword.calledOnceWith(arg)).toBe(true)
  const arg2 = Symbol()
  expect(colorer(arg2)).toBe('')
  expect(colorer.calledOnceWith(arg2)).toBe(true)
})

test('_reset', () => {
  const colorer = chalk.keyword()
  colorer()
  _reset()
  expect(chalk.keyword.notCalled).toBe(true)
  expect(colorer.notCalled).toBe(true)
})
