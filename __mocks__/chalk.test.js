import chalk, { _reset } from './chalk.js'

afterEach(_reset)

test('keyword', () => {
  const colorer = chalk.keyword('red')
  expect(chalk.keyword.calledOnceWith('red')).toBe(true)
  expect(colorer('text')).toBe('\x1B[91m' + 'text' + '\x1B[39m')
  expect(colorer.calledOnceWith('text')).toBe(true)
})

test('_reset', () => {
  const colorer = chalk.keyword()
  colorer()
  _reset()
  expect(chalk.keyword.notCalled).toBe(true)
  expect(colorer.notCalled).toBe(true)
})
